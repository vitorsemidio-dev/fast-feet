import { AuthenticateUseCase } from '@/domain/delivery/application/use-cases/authenticate.use-case'
import { ChangeOrderStatusToShippedUseCase } from '@/domain/delivery/application/use-cases/change-order-status-to-shipped.use-case'
import { CreateAdministratorUseCase } from '@/domain/delivery/application/use-cases/create-administrator.use-case'
import { CreateDeliveryDriverUseCase } from '@/domain/delivery/application/use-cases/create-delivery-driver.use-case'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order.use-case'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangeOrderStatusToShippedController } from './controllers/change-order-status-to-shipped-controller'
import { CreateAdministratorController } from './controllers/create-administrator.controller'
import { CreateDeliveryDriversController } from './controllers/create-delivery-drivers.controller'
import { CreateOrdersController } from './controllers/create-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAdministratorController,
    CreateDeliveryDriversController,
    CreateOrdersController,
    ChangeOrderStatusToShippedController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateAdministratorUseCase,
    CreateDeliveryDriverUseCase,
    CreateOrderUseCase,
    ChangeOrderStatusToShippedUseCase,
  ],
})
export class HTTPModule {}
