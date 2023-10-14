import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  name: string
  postageAt: Date
  status: OrderStatus
  deliveryAt?: Date
  shippedAt?: Date
  shippedBy?: UniqueEntityId
  deliveryBy?: UniqueEntityId
  photoURL?: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export class Order extends Entity<OrderProps> {
  static create(
    props: Optional<OrderProps, 'postageAt' | 'status'>,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        postageAt: props.postageAt ?? new Date(),
        status: props.status ?? OrderStatus.PENDING,
      },
      id,
    )
    return order
  }

  get deliveryAt() {
    return this.props.deliveryAt
  }

  get postageAt() {
    return this.props.postageAt
  }

  get status() {
    return this.props.status
  }

  get shippedAt() {
    return this.props.shippedAt
  }

  get shippedBy() {
    return this.props.shippedBy
  }

  get deliveryBy() {
    return this.props.deliveryBy
  }

  get photoURL() {
    return this.props.photoURL
  }

  ship(shippedBy: UniqueEntityId) {
    this.props.status = OrderStatus.SHIPPED
    this.props.shippedAt = new Date()
    this.props.shippedBy = shippedBy
  }

  delivery(deliveryBy: UniqueEntityId, photoURL: string) {
    if (this.status !== OrderStatus.SHIPPED) return
    if (!deliveryBy || !photoURL) return
    if (deliveryBy.toString() !== this.shippedBy?.toString()) return
    this.props.status = OrderStatus.DELIVERED
    this.props.deliveryAt = new Date()
    this.props.deliveryBy = deliveryBy
    this.props.photoURL = photoURL
  }

  return() {
    this.props.status = OrderStatus.RETURNED
  }

  toJson() {
    return {}
  }
}
