import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { CPFAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/cpf-already-exists.error'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Injectable } from '@nestjs/common'

export type CreateDeliveryDriverUseCaseInput = {
  cpf: string
  name: string
  password: string
}

export type CreateDeliveryDriverUseCaseOutput = Either<
  CPFAlreadyExistsError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class CreateDeliveryDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: CreateDeliveryDriverUseCaseInput): Promise<CreateDeliveryDriverUseCaseOutput> {
    const deliveryDriverAlreadyExists =
      await this.deliveryDriversRepository.findByCPF(cpf)
    if (deliveryDriverAlreadyExists) {
      return left(new CPFAlreadyExistsError(cpf))
    }
    const passwordHashed = await this.hashGenerator.hash(password)
    const deliveryDriver = DeliveryDriver.create({
      cpf: CPF.create(cpf),
      name,
      password: passwordHashed,
    })

    await this.deliveryDriversRepository.create(deliveryDriver)

    return right({ deliveryDriver })
  }
}
