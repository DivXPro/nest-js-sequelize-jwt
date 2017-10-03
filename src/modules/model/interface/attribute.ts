export namespace Attribute {
  export interface Timestamps {
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface Form extends Timestamps {
    id?: number;
    groupId?: number;
    instanceId?: number;
    form?: object | string;
    data?: object | string;
  }

  export interface BpTask extends Timestamps {
    id?: number;
    groupId?: number;
    instanceId?: number;
    processId?: number;
    type?: string;
    option?: object | string;
    userId?: number;
    sequence?: number;
    state?: number;
    comment?: string;
  }

  export interface BpProcess extends Timestamps {
    id?: number;
    bpId?: string;
    groupId?: number;
    instanceId?: number;
    type?: string;
    serial?: number;
    userId?: number;
    approveMode?: number;
    state?: number;
    option?: object | string;
  }

  export interface BpInstance extends Timestamps {
    id?: number;
    groupId?: number;
    userId?: number;
    modelId?: number;
    model?: object | string;
    state?: number;
    relevanceUserId?: number;
    isDeleted?: 0 | 1;
  }

  export interface BpModel extends Timestamps {
    id?: number;
    groupId?: number;
    workflowId?: number;
    model?: object | string;
    form?: object | string;
    isDeleted?: 0 | 1;
  }

  export interface BpWorkflow extends Timestamps {
    id?: number;
    groupId?: number;
    name?: string;
    currentVersionId?: number;
    publishVersionId?: number;
    isDisable?: 0 | 1;
    isDeleted?: 0 | 1;
  }

  export interface Flow extends Timestamps {
    id?: number;
    bpId?: number;
    groupId?: number;
    instanceId?: number;
    sourceRef?: number;
    targetRef?: number;
  }
}
