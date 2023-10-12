import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Public } from '@/infra/auth/public'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreateAdministratorUseCase } from '../../../domain/delivery/application/use-cases/create-administrator.use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAdministratorBodySchema = z.object({
  name: z.string(),
  cpf: z.string().refine((cpf) => CPF.validate(cpf), {
    message: 'CPF invalid',
  }),
  password: z.string(),
})

export type CreateAdministratorBody = z.infer<
  typeof createAdministratorBodySchema
>

@Controller('administrators')
@Public()
export class CreateAdministratorController {
  constructor(
    private readonly createAdministratorUseCase: CreateAdministratorUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createAdministratorBodySchema))
    body: CreateAdministratorBody,
  ) {
    const { cpf, name, password } = body
    const resultOrError = await this.createAdministratorUseCase.execute({
      cpf,
      name,
      password,
    })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }
  }
}
