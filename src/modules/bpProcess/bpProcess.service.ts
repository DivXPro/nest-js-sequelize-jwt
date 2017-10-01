import * as Sequelize from 'sequelize';
import * as _ from 'lodash';
import { Component } from '@nestjs/common';
import { sequelize } from '../common/config/dataBase';
import { ModelService } from '../model/model.service';
import { BpTaskService } from '../bpTask/bpTask.service';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { STATE, PROCESS_TYPE, TASK_TYPE } from '../common/enum';

const LOCK = Sequelize.Transaction.LOCK;

@Component()
export class BpProcessService {
  constructor(
    private model: ModelService,
    private bpTaskService: BpTaskService
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
    where: Sequelize.where,
    transaction?: Sequelize.Transaction,
    lock?: Sequelize.TransactionLockLevel
  ) {
    return this.model.BpProcess.findAll({
      where,
      transaction,
      lock
    });
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
        // TODO: 执行相关发FUNCTION;
        await this.activeTasksOfProcess(bpProcess.id, transaction);
        await this.pass(bpProcess.id, transaction);
        break;
      case PROCESS_TYPE.USERTASK:
        await this.activeTasksOfProcess(bpProcess.id, transaction);
        await bpProcess.save({ transaction });
        break;
      case PROCESS_TYPE.ENDEVENT:
        // TODO: 执行相关发FUNCTION;
        await this.pass(bpProcess.id, transaction);
        break;
      default:
        await this.pass(bpProcess.id, transaction);
        break;
    }
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
        break;
      case PROCESS_TYPE.FUNCTION:
        break;
      case PROCESS_TYPE.USERTASK:
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
      default:
        break;
    }
  }

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
    bpProcess.state = STATE.PASS;
    await bpProcess.save({ transaction });
    if (bpProcess.type === PROCESS_TYPE.ENDEVENT) {
      // TODO: pass Instance
    }
    // TODO: activeNext
  }

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
    bpProcess.state = STATE.REJECT;
    bpProcess.save({ transaction });
  }

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
    bpProcess.state = STATE.IGNORE;
    bpProcess.save({ transaction });
  }

  public async activeNext(
    currentId: number,
    transaction: Sequelize.Transaction
  ) {
    const nextBpProcess = await this.getBpProcess(currentId, transaction, LOCK.UPDATE);
  }
}
