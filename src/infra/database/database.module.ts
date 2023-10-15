import { AdministratorsRepository } from '@/core/repositories/administrators.repository'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { Module } from '@nestjs/common'
import { PrismaAdministratorsRepository } from './repositories/prisma-administrators.repository'
import { PrismaDeliveryDriversRepository } from './repositories/prisma-delivery-drivers.repository'
import { PrismaOrdersRepository } from './repositories/prisma-orders.repository'
import { PrismaRecipientsRepository } from './repositories/prisma-recipients.repository'
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
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdministratorsRepository,
    DeliveryDriversRepository,
    OrdersRepository,
    RecipientsRepository,
  ],
})
export class DatabaseModule {}
