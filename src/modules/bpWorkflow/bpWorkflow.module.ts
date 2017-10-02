import { Module, RequestMethod } from '@nestjs/common';
import { ModelModule } from '../model/model.module';
import { BpWorkflowController } from './bpWorkflow.controller';
import { BpWorkflowService } from './bpWorkflow.service';
import { BpModelModule } from '../bpModel/bpModel.module';
import { BpInstanceModule } from '../bpInstance/bpInstance.module';

@Module({
    modules: [ModelModule, BpModelModule, BpInstanceModule],
    controllers: [BpWorkflowController],
    components: [BpWorkflowService],
    exports: [BpWorkflowService]
})
export class BpWorkflowModule {}
