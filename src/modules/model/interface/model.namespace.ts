import * as Sequelize from 'sequelize';
import { Instance } from './instance';
import { Attribute } from './attribute';

export namespace Models {
  export interface BpWorkflow extends Sequelize.Model<Instance.BpWorkflow, Attribute.BpWorkflow> {}
  export interface BpModel extends Sequelize.Model<Instance.BpModel, Attribute.BpModel> {}
  export interface BpInstance extends Sequelize.Model<Instance.BpInstance, Attribute.BpInstance> {}
  export interface BpProcess extends Sequelize.Model<Instance.BpProcess, Attribute.BpProcess> {}
  export interface BpTask extends Sequelize.Model<Instance.BpTask, Attribute.BpTask> {}
  export interface Form extends Sequelize.Model<Instance.Form, Attribute.Form> {}
  export interface Flow extends Sequelize.Model<Instance.Flow, Attribute.Flow> {}
}