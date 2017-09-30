import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';

@Component()
export class BpModelService {
  constructor(private model: ModelService) {}
  public getModel(id: number) {
    return this.model.BpModel.findById(id);
  }

  public getModels(where?: Sequelize.where) {
    return this.model.BpModel.findAll({
      where,
    });
  }
}
