import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Injectable } from '@nestjs/common'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { CPFAlreadyExistsError } from './errors/cpf-already-exists.error'

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
    private readonly deliverydriversRepository: DeliveryDriversRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: CreateDeliveryDriverUseCaseInput): Promise<CreateDeliveryDriverUseCaseOutput> {
    const deliveryDriverAlreadyExists =
      await this.deliverydriversRepository.findByCPF(cpf)
    if (deliveryDriverAlreadyExists) {
      return left(new CPFAlreadyExistsError(cpf))
    }
    const passwordHashed = await this.hashGenerator.hash(password)
    const deliveryDriver = DeliveryDriver.create({
      cpf: CPF.create(cpf),
      name,
      password: passwordHashed,
    })

    await this.deliverydriversRepository.create(deliveryDriver)

    return right({ deliveryDriver })
  }
}
