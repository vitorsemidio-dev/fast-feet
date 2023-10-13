import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import { HashGenerator } from '../cryptography/hash-generator'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { WrongPasswordError } from './errors/wrong-password.error'

export type ChangePasswordFromDeliveryDriverUseCaseInput = {
  deliveryDriverId: string
  oldPassword: string
  newPassword: string
}

export type ChangePasswordFromDeliveryDriverUseCaseOutput = Either<
  ResourceNotFoundError | WrongPasswordError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class ChangePasswordFromDeliveryDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
    private readonly hashComparer: HashComparer,
    private readonly hashGenerator: HashGenerator,
  ) {}

  public async execute({
    deliveryDriverId,
    oldPassword,
    newPassword,
  }: ChangePasswordFromDeliveryDriverUseCaseInput): Promise<ChangePasswordFromDeliveryDriverUseCaseOutput> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)
    if (!deliveryDriver) {
      return left(new ResourceNotFoundError(deliveryDriverId))
    }
    const passwordMatch = await this.hashComparer.compare(
      oldPassword,
      deliveryDriver.password,
    )
    if (!passwordMatch) {
      return left(new WrongPasswordError())
    }

    deliveryDriver.password = await this.hashGenerator.hash(newPassword)
    await this.deliveryDriversRepository.update(deliveryDriver)

    return right({
      deliveryDriver,
    })
  }
}
