import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Public } from '@/infra/auth/public'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreateDeliveryDriverUseCase } from '../../../domain/delivery/application/use-cases/create-delivery-driver.use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

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
@Public()
export class CreateDeliveryDriversController {
  constructor(
    private readonly createDeliveryDriverUseCase: CreateDeliveryDriverUseCase,
  ) {}

  @Post()
  @HttpCode(201)
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
