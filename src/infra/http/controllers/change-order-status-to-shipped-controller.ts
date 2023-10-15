import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ChangeOrderStatusToShippedUseCase } from '../../../domain/delivery/application/use-cases/change-order-status-to-shipped.use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeOrderStatusToShippedBodySchema = z.object({
  deliveryDriverId: z.string().uuid(),
})

export type ChangeOrderStatusToShippedBody = z.infer<
  typeof changeOrderStatusToShippedBodySchema
>

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
    @Body(new ZodValidationPipe(changeOrderStatusToShippedBodySchema))
    body: ChangeOrderStatusToShippedBody,
    @Param('orderId') orderId: string,
  ) {
    const { deliveryDriverId } = body

    const resultOrError = await this.changeOrderStatusToShippedUseCase.execute({
      orderId,
      deliveryDriverId,
    })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }
  }
}
