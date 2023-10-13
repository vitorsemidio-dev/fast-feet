import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  name: string
  postageAt: Date
  status: OrderStatus
  deliveryAt?: Date
  sendedAt?: Date
  sendedBy?: UniqueEntityId
  deliveryBy?: UniqueEntityId
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SENDED = 'SENDED',
  DELIVERED = 'DELIVERED',
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

  get sendedAt() {
    return this.props.sendedAt
  }

  get sendedBy() {
    return this.props.sendedBy
  }

  get deliveryBy() {
    return this.props.deliveryBy
  }

  send(sendedBy: UniqueEntityId) {
    this.props.status = OrderStatus.SENDED
    this.props.sendedAt = new Date()
    this.props.sendedBy = sendedBy
  }

  delivery(deliveryBy: UniqueEntityId) {
    if (deliveryBy.toString() === this.sendedBy?.toString()) {
      this.props.status = OrderStatus.DELIVERED
      this.props.deliveryAt = new Date()
      this.props.deliveryBy = deliveryBy
    }
  }

  toJson() {
    return {}
  }
}
