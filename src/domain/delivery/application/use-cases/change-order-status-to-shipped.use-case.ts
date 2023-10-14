import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '../../enterprise/entities/order'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

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
