import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { Module } from '@nestjs/common'
import { PrismaAdministratorsRepository } from './repositories/prisma-administrators.repository'
import { PrismaDeliveryDriversRepository } from './repositories/prisma-delivery-drivers.repository'
import { PrismaService } from './services/prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaAdministratorsRepository,
    },
    {
      provide: DeliveryDriversRepository,
      useClass: PrismaDeliveryDriversRepository,
    },
  ],
  exports: [PrismaService, AdministratorsRepository, DeliveryDriversRepository],
})
export class DatabaseModule {}
