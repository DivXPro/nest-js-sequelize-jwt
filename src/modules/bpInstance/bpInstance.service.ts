import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface/attribute';

@Component()
export class BpInstanceService {
  constructor(private model: ModelService) {}
  public getInstance(id: number) {
    return this.model.BpInstance.findById(id);
  }

  public getInstances(where?: Sequelize.where) {
    return this.model.BpInstance.findAll({
      where,
    });
  }

  public createInstance(bpInstance: Attribute.BpInstance) {
    return this.model.BpInstance.create(bpInstance);
  }
}
