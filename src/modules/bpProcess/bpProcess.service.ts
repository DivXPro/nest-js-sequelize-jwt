import * as Sequelize from 'sequelize';
import * as _ from 'lodash';
import { Component } from '@nestjs/common';
import { sequelize } from '../common/config/dataBase';
import { ModelService } from '../model/model.service';
import { BpTaskService } from '../bpTask/bpTask.service';
import { BpInstanceService } from '../bpInstance/bpInstance.service';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { Bpmn, BpmnFlow } from '../interface';
import { STATE, PROCESS_TYPE, TASK_TYPE, APPROVE_MODE } from '../common/enum';

const LOCK = Sequelize.Transaction.LOCK;

@Component()
export class BpProcessService {
  constructor(
    private model: ModelService,
    private bpTaskService: BpTaskService,
    private bpInstanceService: BpInstanceService,
  ) {}
  public getBpProcess(
    id: number,
    transaction?: Sequelize.Transaction,
    lock?: Sequelize.TransactionLockLevel
  ) {
    return this.model.BpProcess.findById(id, {
      transaction,
      lock
    });
  }

  public getBpProcesses(
    where: Sequelize.AnyWhereOptions,
    transaction?: Sequelize.Transaction,
    lock?: Sequelize.TransactionLockLevel
  ) {
    return this.model.BpProcess.findAll({
      where,
      transaction,
      lock
    });
  }

  public getStartEvent(instanceId: number, transaction?: Sequelize.Transaction, lock?: Sequelize.TransactionLockLevel) {
    return this.model.BpProcess.findOne({
      where: {
        instanceId,
        type: PROCESS_TYPE.STARTEVENT,
      },
      transaction,
      lock,
    });
  }

  public getEndEvent(instanceId: number, transaction?: Sequelize.Transaction, lock?: Sequelize.TransactionLockLevel) {
    return this.model.BpProcess.findOne({
      where: {
        instanceId,
        type: PROCESS_TYPE.ENDEVENT,
      },
      transaction,
      lock,
    });
  }

  /**
   * 判断process状态该如何转变
   */
  public async check (id: number, transaction?: Sequelize.Transaction);
  public async check (process: Instance.BpProcess, transaction?: Sequelize.Transaction);
  public async check(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess = typeof process === 'number'
      ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
      : process;
    if (bpProcess == null) {
      // TODO: throw error;
      return;
    }
    switch (bpProcess.type) {
      case PROCESS_TYPE.USERTASK:
        await this.checkUserTasks(bpProcess, transaction);
        break;
      case PROCESS_TYPE.API:
      case PROCESS_TYPE.FUNCTION:
      case PROCESS_TYPE.ENDEVENT:
      default:
        await this.checkTask(bpProcess, transaction);
        break;
    }
  }

  public async checkTask(process: number | Instance.BpProcess, transaction: Sequelize.Transaction) {
    const bpProcess = typeof process === 'number'
      ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
      : process;
    if (bpProcess == null || bpProcess.id == null) {
      // TODO: throw error;
      return;
    }
    const tasks = await this.bpTaskService.getBpTasksOfProcess(bpProcess.id, transaction);
    const passed = _.filter(tasks, task => task.state === STATE.PASS);
    if (passed.length === tasks.length) {
      return this.pass(bpProcess, transaction);
    }
  }
  /**
   * 检查用户任务执行情况
   */
  public async checkUserTasks(process: number | Instance.BpProcess, transaction: Sequelize.Transaction) {
    const bpProcess = typeof process === 'number'
      ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
      : process;
    if (bpProcess == null || bpProcess.id == null) {
      // TODO: throw error;
      return;
    }
    const tasks = await this.bpTaskService.getBpTasksOfProcess(bpProcess.id, transaction);
    switch (bpProcess.approveMode) {
      // 全票通过模式
      case APPROVE_MODE.ALL_PASS:
        if (_.every(tasks, ['state', STATE.PASS])) {
          // 全部task都已经通过则自动通过该process
          return this.pass(bpProcess, transaction);
        } else if (_.findIndex(tasks, task => task.state === STATE.REJECT) > -1) {
          // 如果有一个task被驳回则驳回该process
          // 将未完成的task ignore
          await this.ignoreTasks(tasks, transaction);
          return this.reject(bpProcess, transaction);
        } else if (bpProcess.serial) {
          // 如果未有驳回且没全部完成审批，且为顺序审批则激活剩余的task
          const nextTask = _(tasks)
            .filter(task => task.state === STATE.INIT)
            .minBy(task => task.sequence);
          if (nextTask) {
            await this.bpTaskService.active(nextTask, transaction);
          }
        }
        break;
      // 1票通过 1票拒绝
      case APPROVE_MODE.ONE_PASS:
        if (_.findIndex(tasks, task => task.state === STATE.REJECT) > -1) {
          // 将未完成的task ignore
          await this.ignoreTasks(tasks, transaction);
          await this.reject(bpProcess, transaction);
        } else if (_.findIndex(tasks, task => task.state === STATE.PASS) > -1) {
          // 将未完成的task ignore
          this.ignoreTasks(tasks, transaction);
          await this.pass(bpProcess, transaction);
        }
        break;
      // 1票通过 全票拒绝
      case APPROVE_MODE.ALL_REJECT:
        if (_.every(tasks, ['state', STATE.REJECT])) {
          // 将未完成的task ignore
          await this.ignoreTasks(tasks, transaction);
          await this.reject(bpProcess, transaction);
        } else if (_.findIndex(tasks, task => task.state === STATE.PASS) > -1) {
          // 将未完成的task ignore
          await this.ignoreTasks(tasks, transaction);
          await this.pass(bpProcess, transaction);
        } else if (bpProcess.serial) {
          const nextTask = _(tasks)
            .filter(task => task.state === STATE.INIT)
            .maxBy(task => task.sequence);
          if (nextTask) {
            await this.bpTaskService.active(nextTask, transaction);
          }
        }
        break;
      default:
        throw Error('cant check');
    }
  }

  private async ignoreTasks(tasks: Instance.BpTask[], transaction: Sequelize.Transaction) {
    const ignores = _(tasks)
      .filter(task => task.state === STATE.ACTIVE || task.state === STATE.INIT)
      .map(task => {
        return this.bpTaskService.ignore(task, transaction);
      }).value();
    return Promise.all(ignores);
  }

  public async active(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess =
      typeof process === 'number'
        ? await this.getBpProcess(process, transaction)
        : process;
    if (bpProcess === null || bpProcess.id == null) {
      // TODO: throw error
      return;
    }
    if (bpProcess.state !== STATE.INIT) {
      // TODO: throw error
      return;
    }
    switch (bpProcess.type) {
      case PROCESS_TYPE.STARTEVENT:
        // 激活下一proccess
        await this.pass(bpProcess.id, transaction);
        break;
      case PROCESS_TYPE.GATEWAY:
        await this.pass(bpProcess.id, transaction);
        break;
      case PROCESS_TYPE.JOINGATEWAY:
        // TODO: 考虑是否需忽略joingateway其他分支上的process
        await this.pass(bpProcess.id, transaction);
        break;
      case PROCESS_TYPE.FUNCTION:
      case PROCESS_TYPE.USERTASK:
      case PROCESS_TYPE.ENDEVENT:
      default:
        bpProcess.state = STATE.ACTIVE;
        await bpProcess.save({ transaction });
        await this.activeTasksOfProcess(bpProcess.id, transaction);
        break;
    }
  }

  private async ignoreTasksOfProcess(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess =
      typeof process === 'number'
        ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
        : process;
    if (bpProcess == null || bpProcess.id == null) {
      // TODO: throw error;
      return;
    }
    let tasks = await this.bpTaskService.getBpTasksOfProcess(
      bpProcess.id,
      transaction,
      LOCK.UPDATE
    );
    const activeTasks = _(tasks)
      .filter(
        task =>
          task.state === STATE.INIT && bpProcess.serial
            ? task.sequence === 1
            : true
      )
      .map(task => this.bpTaskService.ignore(task, transaction))
      .value();
    await Promise.all(activeTasks);
  }

  private async activeTasksOfProcess(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess =
      typeof process === 'number'
        ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
        : process;
    if (bpProcess == null || bpProcess.id == null) {
      // TODO: throw error;
      return;
    }
    switch (bpProcess.type) {
      case PROCESS_TYPE.API:
      case PROCESS_TYPE.FUNCTION:
      case PROCESS_TYPE.USERTASK:
      case PROCESS_TYPE.ENDEVENT:
      default:
        let tasks = await this.bpTaskService.getBpTasksOfProcess(
          bpProcess.id,
          transaction,
          LOCK.UPDATE
        );
        const activeTasks = _(tasks)
          .filter(
            task =>
              task.state === STATE.INIT && bpProcess.serial
                ? task.sequence === 1
                : true
          )
          .map(task => this.bpTaskService.active(task, transaction))
          .value();
        await Promise.all(activeTasks);
        break;
    }
  }

  public async pass (id: number, transaction: Sequelize.Transaction);
  public async pass (process: Instance.BpProcess, transaction: Sequelize.Transaction);
  public async pass(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess =
      typeof process === 'number'
        ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
        : process;
    if (bpProcess == null) {
      // TODO: throw error;
      return;
    }
    if (bpProcess.state !== STATE.INIT && bpProcess.state !== STATE.ACTIVE) {
      // TODO: throw error;
      return;
    }
    bpProcess.state = STATE.PASS;
    await bpProcess.save({ transaction });
    // activeNext
    await this.activeNext(bpProcess, transaction);
  }

  public async reject (id: number, transaction?: Sequelize.Transaction);
  public async reject (process: Instance.BpProcess, transaction?: Sequelize.Transaction);
  public async reject(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess =
      typeof process === 'number'
        ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
        : process;
    if (bpProcess == null) {
      // TODO: throw error;
      return;
    }
    if (bpProcess.state !== STATE.INIT && bpProcess.state !== STATE.ACTIVE) {
      // TODO: throw error;
      return;
    }
    bpProcess.state = STATE.REJECT;
    await bpProcess.save({ transaction });
    // ignore 当前process中还未执行的 task
    await this.ignoreTasksOfProcess(bpProcess, transaction);
    // TODO: 判断instance是否陷入死局
  }

  public async ignore (id: number, transaction: Sequelize.Transaction);
  public async ignore (process: Instance.BpProcess, transaction: Sequelize.Transaction);
  public async ignore(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess =
      typeof process === 'number'
        ? await this.getBpProcess(process, transaction, LOCK.UPDATE)
        : process;
    if (bpProcess == null) {
      // TODO: throw error;
      return;
    }
    if (bpProcess.state !== STATE.INIT && bpProcess.state !== STATE.ACTIVE) {
      // TODO: throw error;
      return;
    }
    bpProcess.state = STATE.IGNORE;
    await bpProcess.save({ transaction });
    // ignore 当前process中还未执行的 task
    await this.ignoreTasksOfProcess(bpProcess, transaction);
    // TODO: 判断instance是否陷入死局
  }

  public async getNextFlows(id: number, transaction?: Sequelize.Transaction): Promise<BpmnFlow[]>;
  public async getNextFlows(process: Instance.BpProcess, transaction?: Sequelize.Transaction): Promise<BpmnFlow[]>;
  public async getNextFlows(process: number | Instance.BpProcess, transaction?: Sequelize.Transaction) {
    // const bpInstance = await this.getBpInstance();
    const bpProcess = typeof process === 'number' ? await this.getBpProcess(process) : process;
    if (bpProcess == null || bpProcess.instanceId == null) {
      // TODO: throw error;
      throw Error();
    }
    const bpInstance = await this.bpInstanceService.getBpInstance(bpProcess.instanceId);
    if (bpInstance == null || bpInstance.model == null) {
      // TODO: throw error;
      throw Error();
    }
    const bpmn = JSON.parse(bpInstance.model.toString()) as Bpmn;
    return _.filter(
      bpmn.sequenceFlow,
      flow => flow.sourceRef === bpProcess.bpId
    );
  }

  public async getNextProcesses(id: number, transaction: Sequelize.Transaction);
  public async getNextProcesses(process: Instance.BpProcess, transaction: Sequelize.Transaction);
  public async getNextProcesses(process: number | Instance.BpProcess, transaction: Sequelize.Transaction) {
    const bpProcess = typeof process === 'number' ? await this.getBpProcess(process) : process;
    if (bpProcess == null || bpProcess.instanceId == null) {
      // TODO: throw error;
      return;
    }
    const nextFlows = await this.getNextFlows(bpProcess, transaction);
    return this.getBpProcesses({
      instanceId: bpProcess.instanceId,
      bpId: {
        $in: _.map(nextFlows, flow => flow.targetRef),
      },
    }, transaction, LOCK.UPDATE);
  }

  /**
   * 激活下一环节process
   */
  public async activeNext(id: number, transaction: Sequelize.Transaction);
  public async activeNext(process: Instance.BpProcess, transaction: Sequelize.Transaction);
  public async activeNext(
    process: number | Instance.BpProcess,
    transaction: Sequelize.Transaction
  ) {
    const bpProcess = typeof process === 'number' ? await this.getBpProcess(process) : process;
    if (bpProcess == null || bpProcess.instanceId == null) {
      // TODO: throw error;
      return;
    }
    if (bpProcess.type === PROCESS_TYPE.ENDEVENT) {
      return this.bpInstanceService.pass(bpProcess.instanceId, transaction);
    }
    const nextBpProcesses = await this.getNextProcesses(bpProcess, transaction);
    for (const nextProcess of nextBpProcesses) {
      await this.active(nextProcess, transaction);
    }
  }

  // 创建Process下的 task
  public async makeTasks(id: number, tasks: Attribute.BpTask[], transaction?: Sequelize.Transaction);
  public async makeTasks(process: Instance.BpProcess, tasks: Attribute.BpTask[], transaction?: Sequelize.Transaction);
  public async makeTasks(process: number | Instance.BpProcess, tasks: Attribute.BpTask[], transaction?: Sequelize.Transaction) {
    const bpProcess = typeof process === 'number' ? await this.getBpProcess(process) : process;
    if (bpProcess == null || bpProcess.instanceId == null || !bpProcess.id) {
      // TODO: throw error;
      return;
    }
    switch (bpProcess.type) {
      case PROCESS_TYPE.USERTASK:
        return this.makeUserTasks(bpProcess, tasks, transaction);
      case PROCESS_TYPE.FUNCTION:
        return this.makeFunctionTasks(bpProcess, transaction);
      case PROCESS_TYPE.REJECTEVENT:
        return this.makeFunctionTasks(bpProcess, transaction);
      case PROCESS_TYPE.ENDEVENT:
        return this.makeFunctionTasks(bpProcess, transaction);
      default:
        break;
    }
  }

  /**
   * 创建process下的用户审批任务
   */
  public makeUserTasks(process: Instance.BpProcess, tasks: Attribute.BpTask[], transaction?: Sequelize.Transaction) {
    const bpProcess = process;
    const bpTasks = _.map(tasks, task => {
      return {
        groupId: bpProcess.groupId,
        instanceId: bpProcess.instanceId,
        processId: bpProcess.id,
        type: TASK_TYPE.USERTASK,
        userId: task.userId,
        sequence: task.sequence,
        state: task.state || STATE.INIT,
      };
    });
    // TODO create tasks
  }

  /**
   * 创建process下的内部function任务
   * @param option 任务选项
   * @param t 事务实例
   */
  public makeFunctionTasks(option, t?: sequelize.Transaction) {
    const task = new Task({
      groupId: this.modelInstance.groupId,
      instanceId: this.modelInstance.instanceId,
      processId: this.modelInstance.id,
      type: Task.TYPE.FUNCTION,
      option,
      state: Task.STATE.INIT
    });
    return task.save(null, t);
  }

}
