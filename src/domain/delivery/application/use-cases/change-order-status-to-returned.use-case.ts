import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '../../enterprise/entities/order'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type ChangeOrderStatusToReturnedUseCaseInput = {
  orderId: string
}

export type ChangeOrderStatusToReturnedUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class ChangeOrderStatusToReturnedUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}
  async execute({
    orderId,
  }: ChangeOrderStatusToReturnedUseCaseInput): Promise<ChangeOrderStatusToReturnedUseCaseOutput> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError(orderId))
    }

    order.return()
    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
