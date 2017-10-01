import { Module, RequestMethod } from '@nestjs/common';
import { ModelModule } from '../model/model.module';
import { BpInstanceController } from './bpInstance.controller';
import { BpInstanceService } from './bpInstance.service';

@Module({
    modules: [ModelModule],
    controllers: [BpInstanceController],
    components: [BpInstanceService],
    exports: [BpInstanceService]
})
export class BpInstancelModule {}
