import { Either, left, right } from '@/core/either'
import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { Injectable } from '@nestjs/common'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { CPFAlreadyExistsError } from './errors/cpf-already-exists.error'

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
