import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found.error'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'

export type EditDeliveryDriverUseCaseInput = {
  deliveryDriverId: string
  name: string
}

export type EditDeliveryDriverUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class EditDeliveryDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    deliveryDriverId,
    name,
  }: EditDeliveryDriverUseCaseInput): Promise<EditDeliveryDriverUseCaseOutput> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError(deliveryDriverId))
    }

    deliveryDriver.name = name

    await this.deliveryDriversRepository.update(deliveryDriver)

    return right({
      deliveryDriver,
    })
  }
}
