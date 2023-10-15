import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { InvalidOrderStatusUpdateError } from '@/domain/delivery/application/use-cases/errors/invalid-order-status-update.error'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found.error'
import { Order } from '@/domain/delivery/enterprise/entities/order'

export type ChangeOrderStatusToReturnedUseCaseInput = {
  orderId: string
}

export type ChangeOrderStatusToReturnedUseCaseOutput = Either<
  ResourceNotFoundError | InvalidOrderStatusUpdateError,
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

    const returnOrError = order.return()

    if (returnOrError.isLeft()) {
      return left(returnOrError.value)
    }

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
