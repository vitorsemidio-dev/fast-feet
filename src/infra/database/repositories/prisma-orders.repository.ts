import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/mappers/prisma-order.mapper'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(order)
    await this.prismaService.order.create({ data })
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({ where: { id } })

    if (!order) return null

    return PrismaOrderMapper.toDomain(order)
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(order)

    await this.prismaService.order.update({
      where: { id: order.id.toString() },
      data,
    })
  }
}
