import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found.error'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { Injectable } from '@nestjs/common'

export type ChangeOrderStatusToShippedUseCaseInput = {
  orderId: string
  deliveryDriverId: string
}

export type ChangeOrderStatusToShippedUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class ChangeOrderStatusToShippedUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}
  async execute({
    orderId,
    deliveryDriverId,
  }: ChangeOrderStatusToShippedUseCaseInput): Promise<ChangeOrderStatusToShippedUseCaseOutput> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError(orderId))
    }

    order.ship(new UniqueEntityId(deliveryDriverId))
    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
