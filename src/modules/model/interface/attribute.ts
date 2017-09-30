export namespace Attribute {
  export interface Timestamps {
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface Form extends Timestamps {
    id?: string | number;
    groupId?: string | number;
    instanceId?: string | number;
    form?: string | object;
    data?: string | object;
  }

  export interface Task extends Timestamps {
    id?: string | number;
    groupId?: string | number;
    instanceId?: string | number;
    processId?: string | number;
    type?: string;
    option?: string | object;
    userId?: string | number;
    sequence?: number;
    state?: number;
    comment?: string;
  }

  export interface Process extends Timestamps {
    id?: string | number;
    bpId?: string | number;
    groupId?: string | number;
    instanceId?: string | number;
    parentId?: string | number;
    type?: string;
    serial?: number;
    userId?: string | number;
    approveMode?: number;
    state?: number;
    option?: string;
  }

  export interface BpInstance extends Timestamps {
    id?: string | number;
    groupId?: string | number;
    userId?: string | number;
    modelId?: string | number;
    model?: string | object;
    state?: number;
    relevanceUserId?: string | number;
    isDeleted?: 0 | 1;
  }

  export interface BpModel extends Timestamps {
    id?: string | number;
    groupId?: number;
    parentId?: number;
    model?: string | object;
    form?: string | object;
    isDeleted?: 0 | 1;
  }

  export interface BpRelation extends Timestamps {
    id?: string | number;
    groupId?: string | number;
    name?: string;
    currentVersionId?: number;
    publishVersionId?: number;
    isDisable?: 0 | 1;
    isDeleted?: 0 | 1;
  }

  export interface Flow extends Timestamps {
    id?: string | number;
    bpId?: string | number;
    groupId?: string | number;
    instanceId?: string | number;
    sourceRef?: string | number;
    targetRef?: string | number;
  }
}
