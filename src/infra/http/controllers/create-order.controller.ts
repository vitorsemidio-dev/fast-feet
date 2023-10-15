import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { CreateOrderUseCase } from '../../../domain/delivery/application/use-cases/create-order.use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createOrderBodySchema = z.object({
  recipientId: z.string(),
  name: z.string(),
  CEP: z.string(),
  city: z.string(),
  country: z.string(),
  neighborhood: z.string(),
  number: z.string(),
  state: z.string(),
  street: z.string(),
  complement: z.string().optional(),
})

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class CreateOrdersController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(UserRoles.ADMINISTRATOR)
  async handle(
    @Body(new ZodValidationPipe(createOrderBodySchema))
    body: CreateOrderBody,
  ) {
    const {
      recipientId,
      name,
      CEP,
      city,
      country,
      neighborhood,
      number,
      state,
      street,
      complement,
    } = body

    const resultOrError = await this.createOrderUseCase.execute({
      recipientId,
      name,
      CEP,
      city,
      country,
      neighborhood,
      number,
      state,
      street,
      complement,
    })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }
  }
}
