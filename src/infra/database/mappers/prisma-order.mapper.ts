import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
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
        address: null as any,
        recipientId: null as any,
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
