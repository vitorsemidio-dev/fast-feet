import { CreateDeliveryDriverUseCase } from '@/domain/delivery/application/use-cases/create-delivery-driver.use-case'
import { UserRoles as RolesEnum } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const createDeliveryDriverBodySchema = z.object({
  name: z.string(),
  cpf: z.string().refine((cpf) => CPF.validate(cpf), {
    message: 'CPF invalid',
  }),
  password: z.string(),
})

export type CreateDeliveryDriverBody = z.infer<
  typeof createDeliveryDriverBodySchema
>

@Controller('delivery-drivers')
@UseGuards(JwtAuthGuard)
export class CreateDeliveryDriversController {
  constructor(
    private readonly createDeliveryDriverUseCase: CreateDeliveryDriverUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles(RolesEnum.ADMINISTRATOR)
  async handle(
    @Body(new ZodValidationPipe(createDeliveryDriverBodySchema))
    body: CreateDeliveryDriverBody,
  ) {
    const { cpf, name, password } = body

    const resultOrError = await this.createDeliveryDriverUseCase.execute({
      cpf,
      name,
      password,
    })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }
  }
}
