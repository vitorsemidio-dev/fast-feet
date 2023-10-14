import { Either, Left, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '../../enterprise/entities/order'
import { InvalidDeliveryUpdateError } from './errors/invalid-delivery-update.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type ChangeOrderStatusToDeliveredUseCaseInput = {
  orderId: string
  deliveryDriverId: string
  photoURL: string
}

export type ChangeOrderStatusToDeliveredUseCaseError = Left<
  ResourceNotFoundError | InvalidDeliveryUpdateError,
  undefined
>

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

    const deliveryOrError = order.delivery(
      new UniqueEntityId(deliveryDriverId),
      photoURL,
    )

    if (deliveryOrError?.isLeft()) {
      return deliveryOrError as ChangeOrderStatusToDeliveredUseCaseError
    }

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
