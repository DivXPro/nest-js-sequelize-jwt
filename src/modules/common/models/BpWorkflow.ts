import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeValidate,
  BeforeCreate
} from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';
import { MessageCodeError } from '../lib/error/MessageCodeError';

const tableOptions: IDefineOptions = {
  timestamp: true,
  tableName: 'bp_workflow',
  underscored: true,
  freezeTableName: true
} as IDefineOptions;

@Table(tableOptions)
export class BpWorkflow extends Model<BpWorkflow> {
  @Column({
    type: DataType.BIGINT(14),
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  })
  id: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'group_id',
    allowNull: false,
  })
  groupId: number;

  @Column({
    type: DataType.STRING(100),
    field: 'name',
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BIGINT(14),
    field: 'current_version_id',
  })
  currentVersionId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'publish_version_id',
    allowNull: false,
  })
  publishVersionId: number;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_deleted',
    allowNull: false,
    defaultValue: 0,
  })
  isDeleted: number;
}