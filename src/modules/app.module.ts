'use strict';

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BpModelModule } from './bpModel/bpModel.module';
import { BpWorkflowModule } from './bpWorkflow/bpWorkflow.module';

@Module({
    controllers: [],
    components: [],
    modules: [
        AuthModule,
        UsersModule,
        BpModelModule,
        BpWorkflowModule,
    ],
    exports: []
})
export class ApplicationModule { }
