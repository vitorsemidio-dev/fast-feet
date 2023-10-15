import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { Controller, HttpCode, Param, Patch, UseGuards } from '@nestjs/common'
import { ChangeOrderStatusToShippedUseCase } from '../../../domain/delivery/application/use-cases/change-order-status-to-shipped.use-case'

@Controller('orders/:orderId/ship')
@UseGuards(JwtAuthGuard)
export class ChangeOrderStatusToShippedController {
  constructor(
    private readonly changeOrderStatusToShippedUseCase: ChangeOrderStatusToShippedUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRoles.DELIVERY_DRIVER)
  async handle(
    @CurrentUser() currentUser: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const resultOrError = await this.changeOrderStatusToShippedUseCase.execute({
      orderId,
      deliveryDriverId: currentUser.sub,
    })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }
  }
}
