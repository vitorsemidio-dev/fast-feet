import { AdministratorsRepository } from '@/core/repositories/administrators.repository'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { PrismaAdministratorsRepository } from '@/infra/database/repositories/prisma-administrators.repository'
import { PrismaDeliveryDriversRepository } from '@/infra/database/repositories/prisma-delivery-drivers.repository'
import { PrismaOrdersRepository } from '@/infra/database/repositories/prisma-orders.repository'
import { PrismaRecipientsRepository } from '@/infra/database/repositories/prisma-recipients.repository'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Module } from '@nestjs/common'

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
