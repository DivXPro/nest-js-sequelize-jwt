export interface Bpmn {
  startEvent: BpmnStartEvent;
  endEvent: BpmnEndEvent;
  sequenceFlow: BpmnFlow[];
  gateway: BpmnGateway[];
  process: BpmnProcess[];
  items?: BpmnItem[];
  rejectEvent: BpmnRejectEvent;
}

export interface BpmnItem {
  id: string;
  type: string;
  name?: string;
  option?: object;
}

export interface BpmnStartEvent extends BpmnItem {
}

export interface BpmnEndEvent extends BpmnItem {
}

export interface BpmnRejectEvent extends BpmnItem {
}

export interface BpmnProcess extends BpmnItem {
}

export interface BpmnGateway extends BpmnItem {
}

export interface BpmnFlow extends BpmnItem {
  sourceRef: string;
  targetRef: string;
}

'use strict';

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
  logging: boolean | Function;
  force: boolean;
  timezone: string;
  modelPaths: Array<string>;
}

export interface DBConfig {
  DB_USER: string;
  DB_DIALECT: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_LOG: boolean;
  JWT_ID: string;
  JWT_KEY: string;
}
