import * as _ from 'lodash';
import { Component } from '@nestjs/common';
import {Bpmn, BpmnItem, BpmnStartEvent, BpmnEndEvent, BpmnProcess, BpmnGateway, BpmnFlow} from '../interface';
import { Attribute } from '../model/interface/attribute';
import { Instance } from '../model/interface/instance';

@Component()
export class BpModelParse {
  private bpmn: Bpmn;
  constructor() {}

  public parse(bpModel: Attribute.BpModel) {
    if (bpModel.model) {
      this.bpmn = JSON.parse(bpModel.model.toString());
      this.bpmn.items = _.concat(
        this.bpmn.sequenceFlow,
        this.bpmn.startEvent,
        this.bpmn.endEvent,
        this.bpmn.process,
        this.bpmn.gateway,
      );
    } else {
      // throw error;
    }
  }
  /**
   * 获取所有可行的route集合
   */
  public fetchAllPaths() {
    const startEvent = this.bpmn.startEvent;
    const allPaths: BpmnFlow[][] = [];
    this.findPaths(allPaths, startEvent, []);
    const realPaths = _.filter(
      allPaths,
      path => {
        const first = _.first(path);
        const last = _.last(path);
        return (first && first.type === 'StartEvent' && last && last.type === 'EndEvent') ? true : false;
      }
    );
    return realPaths;
  }

  /**
   * 获取所有路径
   */
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

  private getNext(item: BpmnItem) {
    const _item = <BpmnFlow>item;
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

  private getPrev(item: BpmnItem) {
    const _item = <BpmnFlow>item;
    if (_item.type === 'Flow') {
      return _.filter(this.bpmn.items, prev => _item.sourceRef === prev.id);
    } else {
      return _.filter(
        this.bpmn.sequenceFlow,
        prev => _item.id === prev.targetRef
      );
    }
  }
}