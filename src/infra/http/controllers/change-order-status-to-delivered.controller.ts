import { ChangeOrderStatusToDeliveredUseCase } from '@/domain/delivery/application/use-cases/change-order-status-to-delivered.use-case'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

const changeOrderStatusToDeliveredBodySchema = z.object({
  photoURL: z.string().url(),
})

export type ChangeOrderStatusToDeliveriedBody = z.infer<
  typeof changeOrderStatusToDeliveredBodySchema
>

@Controller('orders/:orderId/delivery')
@UseGuards(JwtAuthGuard)
export class ChangeOrderStatusToDeliveredController {
  constructor(
    private readonly changeOrderStatusToDeliveredUseCase: ChangeOrderStatusToDeliveredUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRoles.DELIVERY_DRIVER)
  async handle(
    @CurrentUser() currentUser: UserPayload,
    @Body(new ZodValidationPipe(changeOrderStatusToDeliveredBodySchema))
    body: ChangeOrderStatusToDeliveriedBody,
    @Param('orderId') orderId: string,
  ) {
    const { photoURL } = body

    const resultOrError =
      await this.changeOrderStatusToDeliveredUseCase.execute({
        orderId,
        deliveryDriverId: currentUser.sub,
        photoURL,
      })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }
  }
}
