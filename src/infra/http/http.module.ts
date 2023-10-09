import { CreateAdministratorUseCase } from '@/domain/delivery/application/use-cases/create-administrator.use-case'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { CreateAdministratorController } from './controllers/create-administrator.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAdministratorController],
  providers: [CreateAdministratorUseCase],
})
export class HTTPModule {}
