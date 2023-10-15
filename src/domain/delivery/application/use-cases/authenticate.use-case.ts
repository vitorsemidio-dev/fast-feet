import { Either, left, right } from '@/core/either'
import { AdministratorsRepository } from '@/core/repositories/administrators.repository'
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

export type AuthenticateUseCaseInput = {
  cpf: string
  password: string
}

export type AuthenticateUseCaseOutput = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private readonly administratorsRepository: AdministratorsRepository,
    private readonly encrypter: Encrypter,
    private readonly hashComparer: HashComparer,
  ) {}
  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
    const administrator = await this.administratorsRepository.findByCPF(cpf)
    if (!administrator) return left(new WrongCredentialsError())
    const isValidPassword = await this.hashComparer.compare(
      password,
      administrator.password,
    )
    if (!isValidPassword) return left(new WrongCredentialsError())
    const accessToken = await this.encrypter.encrypt({
      sub: administrator.id,
    })
    return right({
      accessToken,
    })
  }
}
