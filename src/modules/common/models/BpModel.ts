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
  tableName: 'bp_model',
  underscored: true,
  freezeTableName: true
} as IDefineOptions;

@Table(tableOptions)
export class BpModel extends Model<BpModel> {
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
    field: 'parent_id',
    allowNull: false,
  })
  parentId: number;

  @Column({
    type: DataType.TEXT,
  })
  model: string;

  @Column({
    type: DataType.TEXT
  })
  form: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_deleted',
    allowNull: false,
    defaultValue: 0
  })
  isDeleted: 0 | 1;
}