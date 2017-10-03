import { Module } from '@nestjs/common';
import { BpModelParse } from './bpModel.parse';
import { BpTaskService } from './bpTask.service';
import { BpProcessService } from './bpProcess.service';
import { BpModelService } from './bpModel.service';
import { BpInstanceService } from './bpInstance.service';
import { ModelModule } from '../model/model.module';
import { BpTaskController } from './bpTask.controller';
import { BpProcessController } from './bpProcess.controller';
import { BpModelController } from './bpModel.controller';
import { BpInstanceController } from './bpInstance.controller';
import { BpWorkflowController } from './bpWorkflow.controller';
import { BpWorkflowService } from './bpWorkflow.service';

@Module({
    modules: [ModelModule],
    controllers: [BpWorkflowController, BpModelController, BpInstanceController, BpProcessController, BpTaskController],
    components: [BpWorkflowService, BpModelService, BpInstanceService, BpProcessService, BpTaskService, BpModelParse],
    exports: [BpWorkflowService, BpModelService, BpInstanceService, BpProcessService, BpTaskService, BpModelParse],
})
export class BpWorkflowModule {}
