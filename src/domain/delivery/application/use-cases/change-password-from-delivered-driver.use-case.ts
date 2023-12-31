import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found.error'
import { WrongPasswordError } from '@/domain/delivery/application/use-cases/errors/wrong-password.error'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'

export type ChangePasswordFromDeliveredDriverUseCaseInput = {
  deliveryDriverId: string
  oldPassword: string
  newPassword: string
}

export type ChangePasswordFromDeliveredDriverUseCaseOutput = Either<
  ResourceNotFoundError | WrongPasswordError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class ChangePasswordFromDeliveredDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
    private readonly hashComparer: HashComparer,
    private readonly hashGenerator: HashGenerator,
  ) {}

  public async execute({
    deliveryDriverId,
    oldPassword,
    newPassword,
  }: ChangePasswordFromDeliveredDriverUseCaseInput): Promise<ChangePasswordFromDeliveredDriverUseCaseOutput> {
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
