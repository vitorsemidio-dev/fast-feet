import { Either, left, right } from '@/core/either'
import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type GetDeliveryDrivierByCPFUseCaseInput = {
  cpf: string
}

export type GetDeliveryDrivierByCPFUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    deliveryDriver: DeliveryDriver
  }
>

@Injectable()
export class GetDeliveryDrivierByCPFUseCase {
  constructor(
    private readonly deliveryDriversRepository: DeliveryDriversRepository,
  ) {}

  async execute({
    cpf,
  }: GetDeliveryDrivierByCPFUseCaseInput): Promise<GetDeliveryDrivierByCPFUseCaseOutput> {
    const result = await this.deliveryDriversRepository.findByCPF(cpf)

    if (!result) {
      return left(new ResourceNotFoundError(cpf))
    }

    const deliveryDriver = result
    return right({ deliveryDriver })
  }
}
