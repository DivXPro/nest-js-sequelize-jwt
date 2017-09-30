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
import { BpModelService } from './bpModel.service';
import { ModelService } from '../model/model.service';
import { Attribute } from '../model/interface';

@Controller()
export class BpModelController {
  constructor(private bpModelService: BpModelService) {}
  @Get('models')
  public async index(@Request() req, @Response() res) {
    const models = await this.bpModelService.getModels();
    return res.status(HttpStatus.OK).json(models);
  }
  @Get('models/:id')
  public async show(@Request() req, @Response() res) {
    const id = req.params.id;
    if (!id) throw new MessageCodeError('user:show:missingId');
    const model = await this.bpModelService.getModel(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }
}
