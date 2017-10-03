import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';
import { ModelService } from '../model/model.service';
import { BpModelParse } from './bpModel.parse';
import { BpInstanceService } from './bpInstance.service';
import { STATE } from '../common/enum';

@Component()
export class BpModelService {
  constructor(private model: ModelService, private bpInstanceService: BpInstanceService) {}
  public getBpModel(id: number) {
    return this.model.BpModel.findById(id);
  }

  public getBpModels(where?: Sequelize.where) {
    return this.model.BpModel.findAll({
      where,
    });
  }

  public async createInstanceOfBpModel(id: number, opt) {
    const bpModel = await this.getBpModel(id);
    if (bpModel == null) {
      // throw error
      return;
    }
    const bpInstance = {
      groupId: opt.groupId,
      userId: opt.userId,
      relevanceUserId: opt.relevanceUserId,
      modelId: bpModel.id,
      model: bpModel.model,
      state: STATE.INIT,
    } as Attribute.BpInstance;
    await this.bpInstanceService.createBpInstance(bpInstance);
  }
}
