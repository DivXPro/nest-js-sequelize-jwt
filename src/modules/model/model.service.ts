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
  public BpTask: Models.BpTask;
  public BpWorkflow: Models.BpWorkflow;
  public BpModel: Models.BpModel;
  public BpInstance: Models.BpInstance;
  public BpProcess: Models.BpProcess;
  public Form: Models.Form;
  public Flow: Models.Flow;

  constructor() {
    const DataTypes = Sequelize;
    this.sequelize = sequelize;
    /**
     * 审批版本关联 Model
     */
    this.BpWorkflow = this.sequelize.define<Instance.BpWorkflow, Attribute.BpWorkflow>(
      'bpWorkflow',
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
          field: 'current_version_id'
        },
        publishVersionId: {
          type: DataTypes.BIGINT(14),
          field: 'publish_version_id',
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
        tableName: 'bp_workflow',
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
        workflowId: {
          type: DataTypes.BIGINT(14),
          field: 'workflow_id',
          allowNull: false
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
        underscored: true,
        hooks: {
          afterFind: (bpModel: Attribute.BpModel | Attribute.BpModel[]) => {
            if (Array.isArray(bpModel)) {
              for (const i in bpModel) {
                bpModel[i].model = JSON.parse(<string>bpModel[i].model);
                bpModel[i].form = JSON.parse(<string>bpModel[i].form);
              }
            } else {
              bpModel.model = JSON.parse(<string>bpModel.model);
              bpModel.form = JSON.parse(<string>bpModel.form);
            }
          },
          beforeCreate: (bpModel: Attribute.BpModel) => {
            bpModel.model = typeof bpModel.model === 'object' ? JSON.stringify(bpModel.model) : bpModel.model;
            bpModel.form = typeof bpModel.form === 'object' ? JSON.stringify(bpModel.form) : bpModel.form;
          },
          beforeBulkCreate: (bpModels: Attribute.BpModel[]) => {
            for (const i in bpModels) {
              bpModels[i].model = typeof bpModels[i].model === 'object'
                ? JSON.stringify(bpModels[i].model)
                : bpModels[i].model;
              bpModels[i].form = typeof bpModels[i].form === 'object'
                ? JSON.stringify(bpModels[i].form)
                : bpModels[i].form;
            }
          },
          beforeUpdate: (bpModel: Attribute.BpModel) => {
            bpModel.model = typeof bpModel.model === 'object' ? JSON.stringify(bpModel.model) : bpModel.model;
            bpModel.form = typeof bpModel.form === 'object' ? JSON.stringify(bpModel.form) : bpModel.form;
          },
          beforeBulkUpdate: (bpModels: Attribute.BpModel[]) => {
            for (const i in bpModels) {
              bpModels[i].model = typeof bpModels[i].model === 'object'
                ? JSON.stringify(bpModels[i].model)
                : bpModels[i].model;
              bpModels[i].form = typeof bpModels[i].form === 'object'
                ? JSON.stringify(bpModels[i].form)
                : bpModels[i].form;
            }
          },
        }
      }
    );

    // Instance
    this.BpInstance = this.sequelize.define<Instance.BpInstance, Attribute.BpInstance>(
      'bpInstance',
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
        underscored: true,
        hooks: {
          afterFind: (instance: Attribute.BpInstance | Attribute.BpInstance[]) => {
            if (Array.isArray(instance)) {
              for (const i in instance) {
                instance[i].model = JSON.parse(<string>instance[i].model);
              }
            } else {
              instance.model = JSON.parse(<string>instance.model);
            }
          },
          beforeCreate: (instance: Attribute.BpInstance) => {
            if (typeof instance.model === 'object') {
              instance.model = JSON.stringify(instance.model);
            }
          },
          beforeBulkCreate: (instances: Attribute.BpInstance[]) => {
            for (const i in instances) {
              instances[i].model = typeof instances[i].model === 'object'
                ? JSON.stringify(instances[i].model)
                : instances[i].model;
            }
          },
          beforeUpdate: (instance: Attribute.BpInstance) => {
            if (typeof instance.model === 'object') {
              instance.model = JSON.stringify(instance.model);
            }
          },
          beforeBulkUpdate: (instances: Attribute.BpInstance[]) => {
            for (const i in instances) {
              instances[i].model = typeof instances[i].model === 'object'
                ? JSON.stringify(instances[i].model)
                : instances[i].model;
            }
          },
        }
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
    this.BpProcess = this.sequelize.define<Instance.BpProcess, Attribute.BpProcess>(
      'bpProcess',
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
        underscored: true,
        hooks: {
          afterFind: (process: Attribute.BpProcess | Attribute.BpProcess[]) => {
            if (Array.isArray(process)) {
              for (const i in process) {
                process[i].option = JSON.parse(<string>process[i].option);
              }
            } else {
              process.option = JSON.parse(<string>process.option);
            }
          },
          beforeCreate: (process: Attribute.BpProcess) => {
            if (typeof process.option === 'object') {
              process.option = JSON.stringify(process.option);
            }
          },
          beforeBulkCreate: (processes: Attribute.BpProcess[]) => {
            for (const i in process) {
              processes[i].option = typeof processes[i].option === 'object'
                ? JSON.stringify(processes[i].option)
                : processes[i].option;
            }
          },
          beforeUpdate: (process: Attribute.BpProcess) => {
            if (typeof process.option === 'object') {
              process.option = JSON.stringify(process.option);
            }
          },
          beforeBulkUpdate: (processes: Attribute.BpProcess[]) => {
            for (const i in processes) {
              processes[i].option = typeof processes[i].option === 'object'
                ? JSON.stringify(processes[i].option)
                : processes[i].option;
            }
          },
        }
      }
    );

    // Task
    this.BpTask = this.sequelize.define<Instance.BpTask, Attribute.BpTask>(
      'bPtask',
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
        underscored: true,
        hooks: {
          afterFind: (task: Attribute.BpTask | Attribute.BpTask[]) => {
            if (Array.isArray(task)) {
              for (const i in task) {
                task[i].option = JSON.parse(<string>task[i].option);
              }
            } else {
              task.option = JSON.parse(<string>task.option);
            }
          },
          beforeCreate: (task: Attribute.BpTask) => {
            if (typeof task.option === 'object') {
              task.option = JSON.stringify(task.option);
            }
          },
          beforeBulkCreate: (tasks: Attribute.BpTask[]) => {
            for (const i in tasks) {
              tasks[i].option = typeof tasks[i].option === 'object'
                ? JSON.stringify(tasks[i].option)
                : tasks[i].option;
            }
          },
          beforeUpdate: (task: Attribute.BpTask) => {
            if (typeof task.option === 'object') {
              task.option = JSON.stringify(task.option);
            }
          },
          beforeBulkUpdate: (tasks: Attribute.BpTask[]) => {
            for (const i in tasks) {
              tasks[i].option = typeof tasks[i].option === 'object'
                ? JSON.stringify(tasks[i].option)
                : tasks[i].option;
            }
          },
        }
      }
    );

    this.BpWorkflow.hasMany(this.BpModel, { foreignKey: 'workflowId' });
    this.BpModel.belongsTo(this.BpWorkflow, { foreignKey: 'workflowId' });
    this.BpProcess.belongsTo(this.BpInstance, { foreignKey: 'instanceId' });
    this.BpInstance.belongsTo(this.BpModel, { foreignKey: 'modelId' });
  }
}
