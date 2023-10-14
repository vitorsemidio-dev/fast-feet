import { OrdersRepository } from '@/core/repositories/orders.repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  itens: Order[] = []

  async create(order: Order): Promise<void> {
    this.itens.push(order)
  }

  async findById(id: string): Promise<Order | null> {
    return this.itens.find((item) => item.id.toString() === id) || null
  }

  async save(order: Order): Promise<void> {
    const index = this.itens.findIndex((item) => item.id.equals(order.id))
    if (index > -1) {
      this.itens[index] = order
    }
  }
}
