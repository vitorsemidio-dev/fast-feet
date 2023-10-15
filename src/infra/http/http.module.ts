import { AuthenticateUseCase } from '@/domain/delivery/application/use-cases/authenticate.use-case'
import { ChangeOrderStatusToShippedUseCase } from '@/domain/delivery/application/use-cases/change-order-status-to-shipped.use-case'
import { CreateAdministratorUseCase } from '@/domain/delivery/application/use-cases/create-administrator.use-case'
import { CreateDeliveryDriverUseCase } from '@/domain/delivery/application/use-cases/create-delivery-driver.use-case'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order.use-case'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller'
import { ChangeOrderStatusToShippedController } from '@/infra/http/controllers/change-order-status-to-shipped-controller'
import { CreateAdministratorController } from '@/infra/http/controllers/create-administrator.controller'
import { CreateDeliveryDriversController } from '@/infra/http/controllers/create-delivery-drivers.controller'
import { CreateOrdersController } from '@/infra/http/controllers/create-order.controller'
import { Module } from '@nestjs/common'

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
