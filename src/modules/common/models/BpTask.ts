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
  tableName: 'bp_task',
  underscored: true,
  freezeTableName: true
} as IDefineOptions;

@Table(tableOptions)
export class BpTask extends Model<BpTask> {
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
    allowNull: false
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
    field: 'process_id',
    allowNull: false,
  })
  processId: number;

  @Column({
    type: DataType.STRING(20),
    field: 'type',
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.TEXT,
  })
  option: string | object;

  @Column({
    type: DataType.BIGINT(14),
    field: 'user_id',
    allowNull: true,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER(11),
  })
  sequence: number;

  @Column({
    type: DataType.INTEGER(2),
  })
  state: number;

  @Column({
    type: DataType.TEXT,
  })
  comment: string;
}