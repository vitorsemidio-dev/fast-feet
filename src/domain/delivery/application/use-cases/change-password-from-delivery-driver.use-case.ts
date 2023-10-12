import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { WrongPasswordError } from './errors/wrong-password.error'

export type ChangePasswordFromDeliveryDriverUseCaseInput = {
  deliveryDriverId: string
  oldPassword: string
}

export type ChangePasswordFromDeliveryDriverUseCaseOutput = Either<
  ResourceNotFoundError | WrongPasswordError,
  void
>

export class ChangePasswordFromDeliveryDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  public async execute({
    deliveryDriverId,
    oldPassword,
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

    return right(undefined)
  }
}
