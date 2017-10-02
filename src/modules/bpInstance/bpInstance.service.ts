import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';
import { BpProcessService } from '../bpProcess/bpProcess.service';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { SQL } from '../common/sql';
import { STATE } from '../common/enum';

const LOCK = Sequelize.Transaction.LOCK;

@Component()
export class BpInstanceService {
  constructor(private model: ModelService, private bpProcessService: BpProcessService) {}
  public getBpInstance(id: number, transaction?: Sequelize.Transaction, lock?: Sequelize.TransactionLockLevel) {
    return this.model.BpInstance.findById(id, {
      transaction,
      lock,
    });
  }

  public getBpInstances(where: Sequelize.AnyWhereOptions, transaction?: Sequelize.Transaction, lock?: Sequelize.TransactionLockLevel) {
    return this.model.BpInstance.findAll({
      where,
      transaction,
      lock,
    });
  }

  public createBpInstance(bpInstance: Attribute.BpInstance) {
    return this.model.BpInstance.create(bpInstance);
  }

  public async active(id: number, transaction: Sequelize.Transaction) {
    const bpInstance = await this.getBpInstance(id, transaction, LOCK.UPDATE);
    if (bpInstance == null || bpInstance.id == null) {
      // TODO: throw error
      return;
    }
    if (bpInstance.state === STATE.INIT) {
      bpInstance.state = STATE.ACTIVE;
      await bpInstance.save({ transaction });
      // 激活 STARTEVENT
      const startEvent = await this.bpProcessService.getStartEvent(bpInstance.id, transaction, LOCK.UPDATE);
      if (startEvent == null) {
        // TODO: throw error
        return;
      }
      return this.bpProcessService.active(startEvent, transaction);
    } else {
      // TODO: throw error
    }
  }

  public async pass(id: number, transaction: Sequelize.Transaction) {
    const bpInstance = await this.getBpInstance(id, transaction, LOCK.UPDATE);
    if (bpInstance == null || bpInstance.id == null) {
      // TODO: throw error
      return;
    }
    if (bpInstance.state === STATE.ACTIVE) {
      bpInstance.state = STATE.PASS;
      await bpInstance.save({ transaction });
      // TODO: ingore 未完成的process
    } else {
      // TODO: throw error
    }
  }

  public async reject(id: number, transaction: Sequelize.Transaction) {
    const bpInstance = await this.getBpInstance(id, transaction, LOCK.UPDATE);
    if (bpInstance == null || bpInstance.id == null) {
      // TODO: throw error
      return;
    }
    if (bpInstance.state === STATE.ACTIVE) {
      bpInstance.state = STATE.REJECT;
      await bpInstance.save({ transaction });
      // TODO: ingore 未完成的process
    } else {
      // TODO: throw error
    }
  }

  public async ignore(id: number, transaction: Sequelize.Transaction) {
    const bpInstance = await this.getBpInstance(id, transaction, LOCK.UPDATE);
    if (bpInstance == null || bpInstance.id == null) {
      // TODO: throw error
      return;
    }
    if (bpInstance.state === STATE.ACTIVE) {
      bpInstance.state = STATE.IGNORE;
      await bpInstance.save({ transaction });
      // TODO: ingore 未完成的process
    } else {
      // TODO: throw error
    }
  }

}
