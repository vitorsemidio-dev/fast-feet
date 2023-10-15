import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/mappers/prisma-order.mapper'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class OrderFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async make(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityId,
  ): Promise<Order> {
    const order = makeOrder(override, id)

    const data = PrismaOrderMapper.toPersistence(order)
    await this.prismaService.order.create({ data })

    return order
  }
}
