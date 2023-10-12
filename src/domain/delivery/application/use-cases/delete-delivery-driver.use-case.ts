import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

type DeleteDeliveryDriverUseCaseInput = {
  id: string
}

type DeleteDeliveryDriverUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class DeleteDeliveryDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    id,
  }: DeleteDeliveryDriverUseCaseInput): Promise<DeleteDeliveryDriverUseCaseOutput> {
    const deliveryDriver = await this.deliveryDriversRepository.findById(id)
    if (!deliveryDriver) {
      return left(new ResourceNotFoundError(id))
    }
    await this.deliveryDriversRepository.delete(id)
    return right({
      deliveryDriver,
    })
  }
}
