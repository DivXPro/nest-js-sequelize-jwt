import { Column } from 'sequelize-typescript/lib/annotations/Column';
import * as Sequelize from 'sequelize';
import { Component } from '@nestjs/common';
import { ModelService } from '../model/model.service';

@Component()
export class BpWorkflowService {
  constructor(private model: ModelService) {}
  public getWorkflow(id: number) {
    return this.model.BpWorkflow.findById(id);
  }

  public async getPublishOfWorkflow(id: number) {
    const workflow = await this.model.BpWorkflow.findById(id);
    if (workflow) {
      return workflow.publishVersionId ?  this.model.BpModel.findById(workflow.publishVersionId) : null;
    }
    return null;
  }

  public async getCurrentOfWorkflow(id: number) {
    const workflow = await this.model.BpWorkflow.findById(id);
    if (workflow) {
      return workflow.currentVersionId ?  this.model.BpModel.findById(workflow.currentVersionId) : null;
    }
    return null;
  }

  public getWorkflows(where?: Sequelize.where) {
    return this.model.BpWorkflow.findAll({
      where,
    });
  }
}
