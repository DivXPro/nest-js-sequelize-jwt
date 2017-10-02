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
import { BpTaskService } from './bpTask.service';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface';

@Controller()
export class BpTaskController {
  constructor(private bpTaskService: BpTaskService, private bpInstanceService: BpTaskService) {}
  @Get('tasks')
  public async index(@Request() req, @Response() res) {
    const models = await this.bpTaskService.getBpTasks({});
    return res.status(HttpStatus.OK).json(models);
  }

  @Get('tasks/:id')
  public async show(@Param('id') id, @Response() res) {
    if (!id) throw new MessageCodeError('user:show:missingId');
    const model = await this.bpTaskService.getBpTask(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }
}
