import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';

@Component()
export class BpProcessService {
  constructor(private model: ModelService) {}
  public getProcess(id: number) {
    return this.model.BpProcess.findById(id);
  }

  public getProcesses(where?: Sequelize.where) {
    return this.model.BpProcess.findAll({
      where,
    });
  }
}
