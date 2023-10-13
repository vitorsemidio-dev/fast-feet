import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderProps {
  name: string
}

export class Order extends Entity<OrderProps> {
  static create(props: OrderProps, id?: UniqueEntityId) {
    return new Order(props, id)
  }

  toJson() {
    return {}
  }
}
