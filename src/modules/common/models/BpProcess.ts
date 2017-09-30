import { isNegativeNumberLiteral } from 'tslint/lib';
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
  tableName: 'bp_process',
  freezeTableName: true,
  timestamps: true,
  underscored: true,
} as IDefineOptions;

@Table(tableOptions)
export class BpProcess extends Model<BpProcess> {
  @Column({
    type: DataType.BIGINT(14),
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    field: 'bp_id',
    allowNull: false
  })
  bpId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'group_id',
    allowNull: false,
  })
  groupId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'instance_id',
    allowNull: false,
  })
  instanceId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'parent_id',
    allowNull: false,
  })
  partentId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  })
  serial: 0 | 1;

  @Column({
    type: DataType.INTEGER(2),
    field: 'approve_mode'
  })
  approveMode: number;

  @Column({
    type: DataType.INTEGER(2),
    allowNull: false,
    defaultValue: 0
  })
  state: number;

  @Column({
    type: DataType.TEXT
  })
  option: string;
}