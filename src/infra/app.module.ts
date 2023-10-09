import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { EnvModule } from './env/env.module'
import { AllExceptionFilter } from './filters/all-exception.filter'
import { HTTPModule } from './http/http.module'

@Module({
  imports: [HTTPModule, EnvModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
