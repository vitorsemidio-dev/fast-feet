import { Either, left } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type EditDeliveryDriverUseCaseInput = {
  deliveryDriverId: string
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
  }: EditDeliveryDriverUseCaseInput): Promise<EditDeliveryDriverUseCaseOutput> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError(deliveryDriverId))
    }

    return {} as any
  }
}
