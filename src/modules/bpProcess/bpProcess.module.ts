import { Module, RequestMethod } from '@nestjs/common';
import { ModelModule } from '../model/model.module';
import { BpProcessController } from './bpProcess.controller';
import { BpProcessService } from './bpProcess.service';
import { BpTaskModule } from '../bpTask/bpTask.module';

@Module({
    modules: [ModelModule],
    controllers: [BpProcessController],
    components: [BpProcessService],
    exports: [BpProcessService]
})
export class BpProcesslModule {}
