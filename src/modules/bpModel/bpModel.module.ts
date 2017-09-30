import { Module, RequestMethod } from '@nestjs/common';
import { ModelModule } from '../model/model.module';
import { BpModelController } from './bpModel.controller';
import { BpModelService } from './bpModel.service';

@Module({
    modules: [ModelModule],
    controllers: [BpModelController],
    components: [BpModelService],
    exports: []
})
export class BpModelModule {}
