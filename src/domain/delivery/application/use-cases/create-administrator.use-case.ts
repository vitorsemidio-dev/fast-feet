import { Either, right } from '@/core/either'
import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
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
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: CreateAdministratorUseCaseInput): Promise<CreateAdministratorUseCaseOutput> {
    const passwordHashed = await this.hashGenerator.hash(password)
    const administrator = Administrator.create({
      cpf,
      name,
      password: passwordHashed,
    })

    await this.administratorsRepository.create(administrator)

    return right({ administrator })
  }
}
