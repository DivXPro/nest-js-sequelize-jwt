'use strict';

import { Module } from '@nestjs/common';
import { BpWorkflowModule } from './bpWorkflow/bpWorkflow.module';

@Module({
    controllers: [],
    components: [],
    modules: [
        BpWorkflowModule,
    ],
    exports: []
})
export class ApplicationModule { }
