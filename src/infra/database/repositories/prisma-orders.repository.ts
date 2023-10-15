import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }
  save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
