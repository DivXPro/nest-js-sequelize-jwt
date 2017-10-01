import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { SQL } from '../common/sql';
import { STATE } from '../common/enum';

@Component()
export class BpInstanceService {
  constructor(private model: ModelService) {}
  public getBpInstance(id: number) {
    return this.model.BpInstance.findById(id);
  }

  public getBpInstances(where?: Sequelize.where) {
    return this.model.BpInstance.findAll({
      where,
    });
  }

  public createBpInstance(bpInstance: Attribute.BpInstance) {
    return this.model.BpInstance.create(bpInstance);
  }

  private async occupyBpInstance(id: number, transaction: Sequelize.Transaction) {
    const query = await this.model.sequelize.query(SQL.GET_INSTANCE, {
      replacements: {
        id,
      },
      transaction,
      type: this.model.sequelize.QueryTypes.SELECT,
      model: this.model.BpInstance,
    });
    return query[0] as Instance.BpInstance;
  }

  public async realActive(id: number) {
    const transaction = await this.model.sequelize.transaction();
    try {
      await this.active(id, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  }

  public async active(id: number, transaction: Sequelize.Transaction) {
    const bpInstance = await this.occupyBpInstance(id, transaction);
    if (bpInstance.state === STATE.INIT) {
      bpInstance.state = STATE.ACTIVE;
      await bpInstance.save({ transaction });
      // const start = await this.model.Process.findOne({
      //   where: {
      //     instanceId: this.modelInstance.id,
      //     type: Process.TYPE.STARTEVENT
      //   },
      //   transaction,
      // });
      // if (start == null) {
      //   throw Error('cant active: no process');
      // }
      // const startProcess = new Process(null, this.model);
      // startProcess.loadInstance(start);
      // await startProcess.active(transaction);
  }
}
