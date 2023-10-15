import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'
import {
  Prisma,
  Order as PrismaOrder,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        name: raw.name,
        postageAt: raw.postageAt,
        status: PrismaOrderMapper.toDomainOrderStatus(raw.status),
        address: Address.create({
          CEP: raw.CEP,
          city: raw.city,
          complement: raw.complement,
          country: raw.country,
          neighborhood: raw.neighborhood,
          number: raw.number,
          state: raw.state,
          street: raw.street,
        }),
        recipientId: new UniqueEntityId(raw.recipientId),
        shippedBy: raw.shipperId
          ? new UniqueEntityId(raw.shipperId)
          : undefined,
        shippedAt: raw.shippedAt ? new Date(raw.shippedAt) : undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toDomainOrderStatus(status: PrismaOrderStatus): OrderStatus {
    switch (status) {
      case PrismaOrderStatus.PENDING:
        return OrderStatus.PENDING
      case PrismaOrderStatus.SHIPPED:
        return OrderStatus.SHIPPED
      case PrismaOrderStatus.DELIVERED:
        return OrderStatus.DELIVERED
      case PrismaOrderStatus.RETURNED:
        return OrderStatus.RETURNED
      default:
        return OrderStatus.PENDING
    }
  }

  static toPersistence(data: Order): Prisma.OrderUncheckedCreateInput {
    return {
      name: data.name,
      postageAt: data.postageAt,
      id: data.id.toString(),
      status: PrismaOrderMapper.toPersistenceOrderStatus(data.status),
      recipientId: data.recipientId.toString(),
      CEP: data.address.CEP,
      city: data.address.city,
      country: data.address.country,
      neighborhood: data.address.neighborhood,
      number: data.address.number,
      state: data.address.state,
      street: data.address.street,
      complement: data.address.complement,
      shipperId: data.shippedBy?.toString(),
      shippedAt: data.shippedAt,
    }
  }

  static toPersistenceOrderStatus(status: OrderStatus): PrismaOrderStatus {
    switch (status) {
      case OrderStatus.PENDING:
        return PrismaOrderStatus.PENDING
      case OrderStatus.SHIPPED:
        return PrismaOrderStatus.SHIPPED
      case OrderStatus.DELIVERED:
        return PrismaOrderStatus.DELIVERED
      case OrderStatus.RETURNED:
        return PrismaOrderStatus.RETURNED
      default:
        return PrismaOrderStatus.PENDING
    }
  }
}
