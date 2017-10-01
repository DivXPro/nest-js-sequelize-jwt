import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';

@Component()
export class BpTaskService {
  constructor(private model: ModelService) {}
  public getTask(id: number) {
    return this.model.BpTask.findById(id);
  }

  public getTasks(where?: Sequelize.where) {
    return this.model.BpTask.findAll({
      where,
    });
  }
}
