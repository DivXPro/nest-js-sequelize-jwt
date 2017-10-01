import * as Sequelize from 'sequelize';
import { Attribute } from './attribute';

export namespace Instance {
  export interface BpWorkflow extends Sequelize.Instance<Attribute.BpWorkflow>, Attribute.BpWorkflow { }
  export interface BpModel extends Sequelize.Instance<Attribute.BpModel>, Attribute.BpModel { }
  export interface BpInstance extends Sequelize.Instance<Attribute.BpInstance>, Attribute.BpInstance { }
  export interface BpProcess extends Sequelize.Instance<Attribute.BpProcess>, Attribute.BpProcess { }
  export interface BpTask extends Sequelize.Instance<Attribute.BpTask>, Attribute.BpTask { }
  export interface Form extends Sequelize.Instance<Attribute.Form>, Attribute.Form { }
  export interface Flow extends Sequelize.Instance<Attribute.Flow>, Attribute.Flow { }
}