import * as Sequelize from 'sequelize';
import { Attribute } from './attribute';

export namespace Instance {
  export interface BpRelation extends Sequelize.Instance<Attribute.BpRelation>, Attribute.BpRelation { }
  export interface BpModel extends Sequelize.Instance<Attribute.BpModel>, Attribute.BpModel { }
  export interface BpInstance extends Sequelize.Instance<Attribute.BpInstance>, Attribute.BpInstance { }
  export interface Process extends Sequelize.Instance<Attribute.Process>, Attribute.Process { }
  export interface Task extends Sequelize.Instance<Attribute.Task>, Attribute.Task { }
  export interface Form extends Sequelize.Instance<Attribute.Form>, Attribute.Form { }
  export interface Flow extends Sequelize.Instance<Attribute.Flow>, Attribute.Flow { }
}