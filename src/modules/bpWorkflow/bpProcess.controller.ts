import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Request,
  Response
} from '@nestjs/common';
import { MessageCodeError } from '../common/lib/error/MessageCodeError';
import { sequelize } from '../common/config/dataBase';
import { BpProcessService } from './bpProcess.service';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface';

@Controller()
export class BpProcessController {
  constructor(private bpProcessService: BpProcessService) {}
  @Get('processes')
  public async index(@Request() req, @Response() res) {
    const where = {};
    const models = await this.bpProcessService.getBpProcesses({});
    return res.status(HttpStatus.OK).json(models);
  }
  @Get('processes/:id')
  public async show(@Request() req, @Response() res) {
    const id = req.params.id;
    if (!id) throw new MessageCodeError('user:show:missingId');
    const model = await this.bpProcessService.getBpProcess(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }
}
