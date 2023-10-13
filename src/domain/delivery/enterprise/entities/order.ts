import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  name: string
  postageAt: Date
  status: OrderStatus
  sendedAt?: Date
  sendedBy?: UniqueEntityId
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

  send(sendedBy: UniqueEntityId) {
    this.props.status = OrderStatus.SENDED
    this.props.sendedAt = new Date()
    this.props.sendedBy = sendedBy
  }

  toJson() {
    return {}
  }
}
