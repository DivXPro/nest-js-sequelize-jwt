'use strict';

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BpModelModule } from './bpModel/bpModel.module';

@Module({
    controllers: [],
    components: [],
    modules: [
        AuthModule,
        UsersModule,
        BpModelModule,
    ],
    exports: []
})
export class ApplicationModule { }
