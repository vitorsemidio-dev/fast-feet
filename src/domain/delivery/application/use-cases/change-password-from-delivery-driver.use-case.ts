import { Either, left } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

type ChangePasswordFromDeliveryDriverUseCaseInput = {
  deliveryDriverId: string
}

type ChangePasswordFromDeliveryDriverUseCaseOutput = Either<
  ResourceNotFoundError,
  void
>

export class ChangePasswordFromDeliveryDriverUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  public async execute({
    deliveryDriverId,
  }: ChangePasswordFromDeliveryDriverUseCaseInput): Promise<ChangePasswordFromDeliveryDriverUseCaseOutput> {
    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)
    if (!deliveryDriver) {
      return left(new ResourceNotFoundError(deliveryDriverId))
    }
    return {} as any
  }
}
