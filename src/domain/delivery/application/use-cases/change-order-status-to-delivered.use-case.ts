import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '../../enterprise/entities/order'
import { InvalidDeliveryUpdateError } from './errors/invalid-delivery-update.error'
import { InvalidOrderStatusUpdateError } from './errors/invalid-order-status-update.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type ChangeOrderStatusToDeliveredUseCaseInput = {
  orderId: string
  deliveryDriverId: string
  photoURL: string
}

export type ChangeOrderStatusToDeliveredUseCaseOutput = Either<
  ResourceNotFoundError | InvalidDeliveryUpdateError,
  {
    order: Order
  }
>

export class ChangeOrderStatusToDeliveredUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}
  async execute({
    orderId,
    deliveryDriverId,
    photoURL,
  }: ChangeOrderStatusToDeliveredUseCaseInput): Promise<ChangeOrderStatusToDeliveredUseCaseOutput> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError(orderId))
    }

    if (order.shippedBy?.toString() !== deliveryDriverId) {
      return left(
        new InvalidDeliveryUpdateError(
          `Order ${orderId} is not shipped by ${deliveryDriverId}. Cannot be delivered. Current driver: ${order.shippedBy}`,
        ),
      )
    }

    const updateStatus = order.delivery(
      new UniqueEntityId(deliveryDriverId),
      photoURL,
    )

    if (!updateStatus) {
      return left(
        new InvalidOrderStatusUpdateError(
          `Order ${orderId} is not shipped. Cannot be delivered. Current status: ${order.status}`,
        ),
      )
    }

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
