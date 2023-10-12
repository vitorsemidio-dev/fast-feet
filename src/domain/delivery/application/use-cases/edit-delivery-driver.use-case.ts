import { Either } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type EditDeliveryDriverUseCaseInput = {}

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

  async execute({}: EditDeliveryDriverUseCaseInput): Promise<EditDeliveryDriverUseCaseOutput> {
    return {} as any
  }
}
