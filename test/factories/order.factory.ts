import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order'
import { fakerPtBr } from 'test/utils/faker'
import { makeAddress } from './address.factory'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
): Order {
  const address = makeAddress()
  const order = Order.create(
    {
      name: fakerPtBr.commerce.product(),
      recipientId: new UniqueEntityId(),
      address,
      ...override,
    },
    id,
  )

  return order
}
