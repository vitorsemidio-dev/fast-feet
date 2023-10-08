import { Either, right } from '@/core/either'
import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
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
  constructor(
    private readonly administratorsRepository: AdministratorsRepository,
  ) {}

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

    await this.administratorsRepository.create(administrator)

    return right({ administrator })
  }
}
