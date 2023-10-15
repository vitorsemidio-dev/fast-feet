import { Either, left, right } from '@/core/either'
import { AdministratorsRepository } from '@/core/repositories/administrators.repository'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { CPFAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/cpf-already-exists.error'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Injectable } from '@nestjs/common'

export type CreateAdministratorUseCaseInput = {
  cpf: string
  name: string
  password: string
}

export type CreateAdministratorUseCaseOutput = Either<
  CPFAlreadyExistsError,
  {
    administrator: Administrator
  }
>

@Injectable()
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
    const administratorAlreadyExists =
      await this.administratorsRepository.findByCPF(cpf)
    if (administratorAlreadyExists) {
      return left(new CPFAlreadyExistsError(cpf))
    }
    const passwordHashed = await this.hashGenerator.hash(password)
    const administrator = Administrator.create({
      cpf: CPF.create(cpf),
      name,
      password: passwordHashed,
    })

    await this.administratorsRepository.create(administrator)

    return right({ administrator })
  }
}
