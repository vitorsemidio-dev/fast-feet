import { Order } from '@/domain/delivery/enterprise/entities/order'

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
}
