import { Public } from '@/infra/auth/public.decorator'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateUseCase } from '../../../domain/delivery/application/use-cases/authenticate.use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

export type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('sessions')
@Public()
export class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(authenticateBodySchema))
    body: AuthenticateBody,
  ) {
    const { cpf, password } = body
    const resultOrError = await this.authenticateUseCase.execute({
      cpf,
      password,
    })

    if (resultOrError.isLeft()) {
      throw resultOrError.value
    }

    return {
      accessToken: resultOrError.value.accessToken,
    }
  }
}
