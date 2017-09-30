import { Component } from '@nestjs/common';
import config = require('config');
import * as Sequelize from 'sequelize';
import { Instance } from './interface/instance';
import { Attribute } from './interface/attribute';
import { Models } from './interface/model.namespace';
import { sequelize } from './database';

@Component()
export class ModelService {
  public sequelize: Sequelize.Sequelize;
  public Task: Models.Task;
  public BpRelation: Models.BpRelation;
  public BpModel: Models.BpModel;
  public BpInstance: Models.BpInstance;
  public Process: Models.Process;
  public Form: Models.Form;
  public Flow: Models.Flow;

  constructor() {
    const DataTypes = Sequelize;
    this.sequelize = sequelize;
    /**
     * 审批版本关联 Model
     */
    this.BpRelation = this.sequelize.define<Instance.BpRelation, Attribute.BpRelation>(
      'bpRelation',
      {
        id: {
          type: DataTypes.BIGINT(14),
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        groupId: {
          type: DataTypes.BIGINT(14),
          field: 'group_id',
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(100),
          field: 'name',
          allowNull: false
        },
        currentVersionId: {
          type: DataTypes.BIGINT(14),
          field: 'current_version_id',
        },
        publishVersionId: {
          type: DataTypes.BIGINT(14),
          field: 'publish_version_id',
          allowNull: false,
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          field: 'is_deleted',
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        freezeTableName: true,
        tableName: 'bp_relation',
        timestamps: true,
        underscored: true
      }
    );
    // BpModel
    this.BpModel = this.sequelize.define<Instance.BpModel, Attribute.BpModel>(
      'bpModel',
      {
        id: {
          type: DataTypes.BIGINT(14),
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        groupId: {
          type: DataTypes.BIGINT(14),
          field: 'group_id',
          allowNull: false
        },
        parentId: {
          type: DataTypes.BIGINT(14),
          field: 'parent_id',
        },
        model: {
          type: DataTypes.TEXT
        },
        form: {
          type: DataTypes.TEXT
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          field: 'is_deleted',
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        freezeTableName: true,
        tableName: 'bp_model',
        timestamps: true,
        underscored: true
      }
    );
    // Instance
    this.BpInstance = this.sequelize.define<Instance.BpInstance, Attribute.BpInstance>(
      'instance',
      {
        id: {
          type: DataTypes.BIGINT(14),
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        groupId: {
          type: DataTypes.BIGINT(14),
          field: 'group_id',
          allowNull: false
        },
        userId: {
          type: DataTypes.BIGINT(14),
          field: 'user_id',
          allowNull: false
        },
        modelId: {
          type: DataTypes.BIGINT(14),
          field: 'model_id',
          allowNull: false
        },
        model: {
          type: DataTypes.TEXT
        },
        state: {
          type: DataTypes.INTEGER(2),
          allowNull: false,
          defaultValue: 0
        },
        relevanceUserId: {
          type: DataTypes.BIGINT(14),
          field: 'relevance_user_id',
          allowNull: false
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          field: 'is_deleted',
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        freezeTableName: true,
        tableName: 'bp_instance',
        timestamps: true,
        underscored: true
      }
      );
    this.Flow = this.sequelize.define<Instance.Flow, Attribute.Flow>(
      'flow',
      {
        id: {
          type: DataTypes.BIGINT(14),
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        bpId: {
          type: DataTypes.STRING,
          field: 'bp_id',
          allowNull: false
        },
        groupId: {
          type: DataTypes.BIGINT(14),
          field: 'group_id',
          allowNull: false
        },
        instanceId: {
          type: DataTypes.BIGINT(14),
          field: 'instance_id',
          allowNull: false
        },
        sourceRef: {
          type: DataTypes.STRING,
          field: 'source_ref',
          allowNull: false
        },
        targetRef: {
          type: DataTypes.STRING,
          field: 'target_ref',
          allowNull: false
        }
      },
      {
        freezeTableName: true,
        tableName: 'bp_flow',
        timestamps: true,
        underscored: true
      }
    );
    // Process
    this.Process = this.sequelize.define<Instance.Process, Attribute.Process>(
      'process',
      {
        id: {
          type: DataTypes.BIGINT(14),
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        bpId: {
          type: DataTypes.STRING,
          field: 'bp_id',
          allowNull: false
        },
        groupId: {
          type: DataTypes.BIGINT(14),
          field: 'group_id',
          allowNull: false
        },
        instanceId: {
          type: DataTypes.BIGINT(14),
          field: 'instance_id',
          allowNull: false
        },
        parentId: {
          type: DataTypes.BIGINT(14),
          field: 'parent_id',
          allowNull: true
        },
        type: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        serial: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0
        },
        approveMode: {
          type: DataTypes.INTEGER(2),
          field: 'approve_mode'
        },
        state: {
          type: DataTypes.INTEGER(2),
          allowNull: false,
          defaultValue: 0
        },
        option: {
          type: DataTypes.TEXT
        }
      },
      {
        freezeTableName: true,
        tableName: 'bp_process',
        timestamps: true,
        underscored: true
      }
    );
    // Task
    this.Task = this.sequelize.define<Instance.Task, Attribute.Task>(
      'task',
      {
        id: {
          type: DataTypes.BIGINT(14),
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        groupId: {
          type: DataTypes.BIGINT(14),
          field: 'group_id',
          allowNull: false
        },
        instanceId: {
          type: DataTypes.BIGINT(14),
          field: 'instance_id',
          allowNull: false
        },
        processId: {
          type: DataTypes.BIGINT(14),
          field: 'process_id',
          allowNull: false
        },
        type: {
          type: DataTypes.STRING(20),
          field: 'type',
          allowNull: false
        },
        option: {
          type: DataTypes.TEXT
        },
        userId: {
          type: DataTypes.BIGINT(14),
          field: 'user_id',
          allowNull: true
        },
        sequence: {
          type: DataTypes.INTEGER(11)
        },
        state: {
          type: DataTypes.INTEGER(2)
        },
        comment: {
          type: DataTypes.TEXT
        }
      },
      {
        freezeTableName: true,
        tableName: 'bp_task',
        timestamps: true,
        underscored: true
      }
    );
  }
}
