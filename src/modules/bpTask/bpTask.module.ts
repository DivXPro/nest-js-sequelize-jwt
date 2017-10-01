import { Module, RequestMethod } from '@nestjs/common';
import { ModelModule } from '../model/model.module';
import { BpTaskController } from './bpTask.controller';
import { BpTaskService } from './bpTask.service';

@Module({
    modules: [ModelModule],
    controllers: [BpTaskController],
    components: [BpTaskService],
    exports: [BpTaskService]
})
export class BpTaskModule {}
