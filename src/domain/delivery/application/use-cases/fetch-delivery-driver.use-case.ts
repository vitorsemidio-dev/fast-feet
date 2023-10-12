import { Either, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Injectable } from '@nestjs/common'

export type FetchDeliveryDriverUseCaseInput = {}

export type FetchDeliveryDriverUseCaseOutput = Either<
  undefined,
  {
    deliveryDrivers: DeliveryDriver[]
  }
>

@Injectable()
export class FetchDeliveryDriverUseCase {
  constructor(
    private readonly deliverydriversRepository: DeliveryDriversRepository,
  ) {}

  async execute(
    params?: FetchDeliveryDriverUseCaseInput,
  ): Promise<FetchDeliveryDriverUseCaseOutput> {
    const result = await this.deliverydriversRepository.findMany()

    const deliveryDrivers = result
    return right({ deliveryDrivers })
  }
}
