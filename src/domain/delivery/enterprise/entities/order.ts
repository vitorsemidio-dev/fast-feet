import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  name: string
  postageAt: Date
}

export class Order extends Entity<OrderProps> {
  static create(props: Optional<OrderProps, 'postageAt'>, id?: UniqueEntityId) {
    const order = new Order(
      { ...props, postageAt: props.postageAt ?? new Date() },
      id,
    )
    return order
  }

  get postageAt() {
    return this.props.postageAt
  }

  toJson() {
    return {}
  }
}
