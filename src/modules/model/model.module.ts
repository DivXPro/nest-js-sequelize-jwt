import { Module } from '@nestjs/common';
import { ModelService } from './model.service';

@Module({
    components: [ModelService],
    exports: [ModelService]
})
export class ModelModule { }
