import _ = require('lodash');
import Bluebird = require('bluebird');
import sequelize = require('sequelize');
import { Model } from '../model';
import { Models } from '../model/models';
import { Attribute } from '../model/attribute';
import { Instance } from '../model/instance';
import { Task } from './task';
import { BpInstance } from './bpInstance';
import * as BPMN from '../interface';

enum STATE {
  INIT = 0,
  ACTIVE = 1,
  COMPLETED = 2
}

const SQL = {
  GET_BPMODEL: 'SELECT * FROM bp_model WHERE id = :id LIMIT 1 FOR UPDATE'
};

export class BpModel {
  static STATE = STATE;
  private model: Model;
  private modelInstance: Instance.BpModel;
  private bpmn: BPMN.Bpmn;

  constructor(bpModel?: Attribute.BpModel, model?: Model) {
    this.model = model || new Model();
    if (bpModel) {
      this.modelInstance = this.model.BpModel.build({
        id: bpModel.id,
        groupId: bpModel.groupId,
        parentId: bpModel.parentId,
        model: bpModel.model,
        isDeleted: bpModel.isDeleted
      });
      this.bpmn = JSON.parse(this.modelInstance.model.toString());
      this.bpmn.items = _.concat(
        this.bpmn.sequenceFlow,
        this.bpmn.startEvent,
        this.bpmn.endEvent,
        this.bpmn.rejectEvent,
        this.bpmn.process,
        this.bpmn.gateway,
      );
    }
  }

  public loadInstance(model: Instance.BpModel) {
    this.modelInstance = model;
    this.bpmn = JSON.parse(this.modelInstance.model.toString());
    this.bpmn.items = _.concat(
      this.bpmn.sequenceFlow,
      this.bpmn.startEvent,
      this.bpmn.endEvent,
      this.bpmn.rejectEvent,
      this.bpmn.process,
      this.bpmn.gateway
    );
  }

  public save(fields?: string[], transaction?: sequelize.Transaction) {
    return this.modelInstance.save({ fields, transaction });
  }

  public get(key: string, options?: object) {
    return this.modelInstance.get(key, options);
  }

  public set(key: string, value: any, options?: object) {
    return this.modelInstance.set(key, value, options);
  }

  public setBpmn(bpmn) {
    this.bpmn = JSON.parse(bpmn.toString());
    this.bpmn.items = _.concat(
      this.bpmn.sequenceFlow,
      this.bpmn.startEvent,
      this.bpmn.endEvent,
      this.bpmn.process,
      this.bpmn.gateway,
      this.bpmn.rejectEvent,
    );
  }

  public async makeInstance(userId, relevanceUserId, model?) {
    const bpInstance = new BpInstance({
      userId,
      groupId: this.modelInstance.groupId,
      modelId: this.modelInstance.id,
      model: model || this.modelInstance.model,
      state: BpInstance.STATE.INIT,
      relevanceUserId,
      isDeleted: 0
    });
    return await bpInstance.save();
  }

  // 获取所有可行的route集合
  public fetchAllPaths() {
    const startEvent = this.bpmn.startEvent;
    const allPaths: BPMN.BpmnFlow[][] = [];
    this.findPaths(allPaths, startEvent, []);
    const realPaths = _.filter(
      allPaths,
      path =>
        _.first(path).type === 'StartEvent' && _.last(path).type === 'EndEvent'
    );
    return realPaths;
  }

  // 获取RejectEvent
  public fetchRejectEvent() {
    return this.bpmn.rejectEvent;
  }

  // 获取路线
  public findPaths(allPaths, item, tmp) {
    let _tmp = _.clone(tmp);
    _tmp.push(item);
    // 没有后续flow
    const nexts = this.getNext(item);
    if (nexts.length === 0) {
      if (item.type === 'EndEvent') {
        allPaths.push(_tmp);
      }
      return;
    }

    for (let i = 0; i < nexts.length; i += 1) {
      this.findPaths(allPaths, nexts[i], _tmp);
    }
  }

  private getNext(item: BPMN.BpmnItem) {
    const _item = <BPMN.BpmnFlow>item;
    switch (_item.type) {
      case 'Flow':
        return _.filter(this.bpmn.items, next => _item.targetRef === next.id);
      default:
        return _.filter(
          this.bpmn.sequenceFlow,
          next => _item.id === next.sourceRef
        );
    }
  }

  private getPrev(item: BPMN.BpmnItem) {
    const _item = <BPMN.BpmnFlow>item;
    if (_item.type === 'Flow') {
      return _.filter(this.bpmn.items, prev => _item.sourceRef === prev.id);
    } else {
      return _.filter(
        this.bpmn.sequenceFlow,
        prev => _item.id === prev.targetRef
      );
    }
  }

  static async getBpModelById(id: number | string) {
    const model = new Model();
    const bpModel = new BpModel();
    bpModel.loadInstance(await model.BpModel.findById(id));
    return bpModel;
  }
}
