import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
import { Module } from '@nestjs/common'
import { PrismaAdministratorsRepository } from './repositories/prisma-administrators.repository'
import { PrismaService } from './services/prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaAdministratorsRepository,
    },
  ],
  exports: [PrismaService, AdministratorsRepository],
})
export class DatabaseModule {}
