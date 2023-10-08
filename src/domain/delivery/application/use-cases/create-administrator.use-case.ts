import { Either, right } from '@/core/either'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'

export type CreateAdministratorUseCaseInput = {
  cpf: string
  name: string
  password: string
}

export type CreateAdministratorUseCaseOutput = Either<
  undefined,
  {
    administrator: Administrator
  }
>

export class CreateAdministratorUseCase {
  async execute({
    cpf,
    name,
    password,
  }: CreateAdministratorUseCaseInput): Promise<CreateAdministratorUseCaseOutput> {
    const administrator = Administrator.create({
      cpf,
      name,
      password,
    })

    return right({ administrator })
  }
}
