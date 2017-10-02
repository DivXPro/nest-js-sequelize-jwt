import { Module, RequestMethod } from '@nestjs/common';
import { ModelModule } from '../model/model.module';
import { BpProcesslModule } from '../bpProcess/bpProcess.module';
import { BpInstanceController } from './bpInstance.controller';
import { BpInstanceService } from './bpInstance.service';

@Module({
    modules: [ModelModule, BpProcesslModule],
    controllers: [BpInstanceController],
    components: [BpInstanceService],
    exports: [BpInstanceService]
})
export class BpInstanceModule {}
