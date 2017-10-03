import * as Sequelize from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Request,
  Response,
  Param,
  Body,
} from '@nestjs/common';
export { Request, Response } from 'express';
import { MessageCodeError } from '../common/lib/error/MessageCodeError';
import { sequelize } from '../common/config/dataBase';
import { BpInstanceService } from './bpInstance.service';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface';

@Controller()
export class BpInstanceController {
  constructor(private bpInstanceService: BpInstanceService) {}
  @Get('instances')
  public async index(@Request() req, @Response() res) {
    const where = {} as Sequelize.AnyWhereOptions;
    const models = await this.bpInstanceService.getBpInstances(where);
    return res.status(HttpStatus.OK).json(models);
  }

  @Get('instances/:id')
  public async show(@Param('id') id, @Response() res) {
    if (!id) throw new MessageCodeError('user:show:missingId');
    const model = await this.bpInstanceService.getBpInstance(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }
}
