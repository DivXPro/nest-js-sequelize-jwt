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
  tableName: 'bp_instance',
  underscored: true,
  freezeTableName: true
} as IDefineOptions;

@Table(tableOptions)
export class BpInstance extends Model<BpInstance> {
  @Column({
    type: DataType.BIGINT(14),
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'group_id',
    allowNull: false,
  })
  groupId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'user_id',
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'model_id',
    allowNull: false,
  })
  modelId: number;

  @Column({
    type: DataType.TEXT,
  })
  model: string;

  @Column({
    type: DataType.INTEGER(2),
    allowNull: false,
    defaultValue: 0
  })
  state: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'relevance_user_id',
    allowNull: false
  })
  relevanceId: number;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_deleted',
    allowNull: false,
    defaultValue: 0
  })
  isDeleted: 0 | 1;
}