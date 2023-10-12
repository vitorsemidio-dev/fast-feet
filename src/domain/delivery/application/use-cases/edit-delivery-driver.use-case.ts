import { Either } from '@/core/either'
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
  async execute({}: EditDeliveryDriverUseCaseInput): Promise<EditDeliveryDriverUseCaseOutput> {
    return {} as any
  }
}
