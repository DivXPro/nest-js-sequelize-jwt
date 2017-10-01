import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Request,
  Response,
  Param
} from '@nestjs/common';
import { MessageCodeError } from '../common/lib/error/MessageCodeError';
import { sequelize } from '../common/config/dataBase';
import { BpWorkflowService } from './bpWorkflow.service';
import { ModelService } from '../model/model.service';
import { BpInstanceService } from '../bpInstance/bpInstance.service';
import { Attribute } from '../model/interface';

@Controller()
export class BpWorkflowController {
  constructor(private bpWorkflowService: BpWorkflowService, private bpInstanceService: BpInstanceService) {}
  @Get('workflows')
  public async index(@Request() req, @Response() res) {
    const models = await this.bpWorkflowService.getWorkflows();
    return res.status(HttpStatus.OK).json(models);
  }
  @Get('workflows/:id')
  public async show(@Request() req, @Response() res) {
    const id = req.params.id;
    if (!id) throw new MessageCodeError('user:show:missingId');
    const model = await this.bpWorkflowService.getWorkflow(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Get('workflows/:id/publish')
  public async showPublish(@Request() req, @Response() res) {
    const id = req.params.id;
    if (!id) throw new MessageCodeError('workflow:showPublish:missingId');
    const model = await this.bpWorkflowService.getPublishOfWorkflow(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Get('workflows/:id/current')
  public async showCurrent(@Request() req, @Response() res) {
    const id = req.params.id;
    if (!id) throw new MessageCodeError('workflow:showCurrent:missingId');
    const model = await this.bpWorkflowService.getCurrentOfWorkflow(id);
    if (model) {
      return res.status(HttpStatus.OK).json(model);
    } else {
      return res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Post('workflows/:id/instance')
  public async createInstance(@Param('id') id: number, @Response() res) {
    if (!id) throw new MessageCodeError('workflow:showCurrent:missingId');
    const userId = 1;
    const groupId = 1;
    const bpModel = await this.bpWorkflowService.getPublishOfWorkflow(id);
    if (bpModel) {
      const inst = {
        userId,
        groupId,
        modelId: bpModel.id,
        model: bpModel.model,
        relevanceUserId: userId,
      };
      const bpInstance = await this.bpInstanceService.createInstance(inst);
      return res.status(HttpStatus.OK).json(bpInstance.get({ plain: true }));
    }
  }
}
