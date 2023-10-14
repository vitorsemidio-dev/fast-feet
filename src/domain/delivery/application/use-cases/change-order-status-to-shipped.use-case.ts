import { Either, left } from '@/core/either'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type ChangeOrderStatusToShippedUseCaseInput = {
  orderId: string
}

export type ChangeOrderStatusToShippedUseCaseOutput = Either<
  ResourceNotFoundError,
  void
>

export class ChangeOrderStatusToShippedUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}
  async execute({
    orderId,
  }: ChangeOrderStatusToShippedUseCaseInput): Promise<ChangeOrderStatusToShippedUseCaseOutput> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError(orderId))
    }

    return {} as any
  }
}
