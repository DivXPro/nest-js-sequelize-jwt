import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { STATE, PROCESS_TYPE, TASK_TYPE } from '../common/enum';

const LOCK = Sequelize.Transaction.LOCK;

@Component()
export class BpTaskService {
  constructor(private model: ModelService) {}
  public getBpTask(
    id: number,
    transaction?: Sequelize.Transaction,
    lock?: Sequelize.TransactionLockLevel
  ) {
    return this.model.BpTask.findById(id, { transaction, lock });
  }

  public getBpTasks(
    where: Sequelize.AnyWhereOptions,
    transaction?: Sequelize.Transaction,
    lock?: Sequelize.TransactionLockLevel
  ) {
    return this.model.BpTask.findAll({
      where,
      transaction,
      lock
    });
  }

  public getBpTasksOfProcess(
    processId: number,
    transaction?: Sequelize.Transaction,
    lock?: Sequelize.TransactionLockLevel
  ) {
    const where = { processId };
    return this.getBpTasks(where, transaction, lock);
  }

  public async doFunction() {
    // TODO:
  }

  public async active(
    task: number | Instance.BpTask,
    transaction: Sequelize.Transaction
  ) {
    const bpTask =
      typeof task === 'number'
        ? await this.getBpTask(task, transaction, LOCK.UPDATE)
        : task;
    if (bpTask == null) {
      // TODO: throw error;
      return;
    }
    switch (bpTask.type) {
      case TASK_TYPE.FUNCTION:
      case TASK_TYPE.USERTASK:
        bpTask.state = STATE.ACTIVE;
        await bpTask.save({ transaction });
        break;
      default:
        bpTask.state = STATE.ACTIVE;
        await bpTask.save({ transaction });
        break;
    }
  }

  public async pass(
    task: number | Instance.BpTask,
    transaction: Sequelize.Transaction
  ) {
    const bpTask =
      typeof task === 'number'
        ? await this.getBpTask(task, transaction, LOCK.UPDATE)
        : task;
    if (bpTask == null) {
      // TODO: throw error;
      return;
    }
    bpTask.state = STATE.PASS;
    return bpTask.save({ transaction });
  }

  public async reject(
    task: number | Instance.BpTask,
    transaction: Sequelize.Transaction
  ) {
    const bpTask =
      typeof task === 'number'
        ? await this.getBpTask(task, transaction, LOCK.UPDATE)
        : task;
    if (bpTask == null) {
      // TODO: throw error;
      return;
    }
    bpTask.state = STATE.REJECT;
    return bpTask.save({ transaction });
  }

  public async ignore(
    task: number | Instance.BpTask,
    transaction: Sequelize.Transaction
  ) {
    const bpTask =
      typeof task === 'number'
        ? await this.getBpTask(task, transaction, LOCK.UPDATE)
        : task;
    if (bpTask == null) {
      // TODO: throw error;
      return;
    }
    bpTask.state = STATE.IGNORE;
    return bpTask.save({ transaction });
  }
}
