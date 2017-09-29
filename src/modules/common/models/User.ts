'use strict';

import * as crypto from 'crypto';
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
  tableName: 'user',
  underscored: true,
  freezeTableName: true
} as IDefineOptions;

@Table(tableOptions)
export class User extends Model<User> {
  @Column({
    type: DataType.BIGINT(14),
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING,
    field: 'name_pinyin'
  })
  namePinyin;

  @Column({
    type: DataType.BIGINT(14),
    field: 'account_id'
  })
  accountId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'corp_id',
    allowNull: false
  })
  corpId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'group_id',
    allowNull: false
  })
  groupId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'dept_id'
  })
  deptId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'position_id'
  })
  positionId: number;

  @Column({
    type: DataType.BIGINT(14),
    field: 'rank_id'
  })
  rankId: number;

  @Column({
    type: DataType.INTEGER(14),
    field: 'cost_center_id'
  })
  costCenterId: number;

  @Column({
    type: DataType.INTEGER(14),
    field: 'payroll_group_id',
    allowNull: false,
    defaultValue: 0
  })
  payrollGroupId: number;

  @Column({
    type: DataType.STRING
  })
  phone: string;

  @Column({
    type: DataType.STRING
  })
  mail: string;

  @Column({
    type: DataType.INTEGER(1)
  })
  state: 0 | 1;

  @Column({
    type: DataType.STRING,
    field: 'job_number'
  })
  jobNumber: string;

  @Column({
    type: DataType.DATE,
    field: 'entry_date'
  })
  entryDate: Date;

  @Column({
    type: DataType.DATE,
    field: 'positive_date'
  })
  positiveDate: Date;

  @Column({
    type: DataType.DATE,
    field: 'leave_date'
  })
  leaveDate: Date;

  @Column({
    type: DataType.INTEGER(1),
    field: 'type'
  })
  type: number;

  @Column({
    type: DataType.INTEGER(1),
    field: 'is_deleted'
  })
  isDeleted: 0 | 1;
}
