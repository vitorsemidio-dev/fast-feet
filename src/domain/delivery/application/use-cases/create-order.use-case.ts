import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '@/core/repositories/orders.repository'
import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { Order } from '../../enterprise/entities/order'
import { Address } from '../../enterprise/entities/value-objects/address'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type CreateOrderUseCaseInput = {
  recipientId: string
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  CEP: string
  country: string
}

export type CreateOrderUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private readonly recipientsRepository: RecipientsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}
  async execute({
    recipientId,
    name,
    CEP,
    city,
    country,
    neighborhood,
    number,
    state,
    street,
    complement,
  }: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput> {
    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) {
      return left(new ResourceNotFoundError(recipientId))
    }
    const address = Address.create({
      CEP,
      city,
      country,
      neighborhood,
      number,
      state,
      street,
      complement,
    })
    const order = Order.create({
      address,
      recipientId: new UniqueEntityId(recipientId),
      name,
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
