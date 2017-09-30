import * as Sequelize from 'sequelize';
import { Instance } from './instance';
import { Attribute } from './attribute';

export namespace Models {
  export interface BpRelation extends Sequelize.Model<Instance.BpRelation, Attribute.BpRelation> {}
  export interface BpModel extends Sequelize.Model<Instance.BpModel, Attribute.BpModel> {}
  export interface BpInstance extends Sequelize.Model<Instance.BpInstance, Attribute.BpInstance> {}
  export interface Process extends Sequelize.Model<Instance.Process, Attribute.Process> {}
  export interface Task extends Sequelize.Model<Instance.Task, Attribute.Task> {}
  export interface Form extends Sequelize.Model<Instance.Form, Attribute.Form> {}
  export interface Flow extends Sequelize.Model<Instance.Flow, Attribute.Flow> {}
}