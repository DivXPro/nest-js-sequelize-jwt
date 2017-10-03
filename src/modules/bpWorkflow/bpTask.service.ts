import * as Sequelize from 'sequelize';
import { Component, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ModelService } from '../model/model.service';
import { BpProcessService } from './bpProcess.service';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { STATE, PROCESS_TYPE, TASK_TYPE } from '../common/enum';

const LOCK = Sequelize.Transaction.LOCK;

@Component()
export class BpTaskService implements OnModuleInit {
  private bpProcessService: BpProcessService;
  constructor(private model: ModelService, private readonly moduleRef: ModuleRef) {}
  onModuleInit() {
    this.bpProcessService = this.moduleRef.get<BpProcessService>(BpProcessService);
  }

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

  public createBpTask(task: Attribute.BpTask, transaction?: Sequelize.Transaction) {
    return this.model.BpTask.create(task, {
      transaction,
    });
  }

  public createBpTasks(tasks: Attribute.BpTask[], transaction?: Sequelize.Transaction) {
    return this.model.BpTask.bulkCreate(tasks, {
      transaction,
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

  public async doFunction(task: Instance.BpTask) {
    // TODO:
  }

  public async doApi(task: Instance.BpTask) {
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
      case TASK_TYPE.API:
        await this.doApi(bpTask);
        await this.pass(bpTask, transaction);
        break;
      case TASK_TYPE.FUNCTION:
        await this.doFunction(bpTask);
        await this.pass(bpTask, transaction);
        break;
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
    await bpTask.save({ transaction });
    if (bpTask.processId) {
      return this.bpProcessService.check(bpTask.processId, transaction);
    }
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
    await bpTask.save({ transaction });
    if (bpTask.processId) {
      return this.bpProcessService.check(bpTask.processId, transaction);
    }
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
