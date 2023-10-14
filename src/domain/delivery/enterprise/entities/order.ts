import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Address } from './value-objects/address'

export interface OrderProps {
  name: string
  recipientId: UniqueEntityId
  postageAt: Date
  status: OrderStatus
  address: Address
  deliveryAt?: Date
  shippedAt?: Date
  returnedAt?: Date
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

  get name() {
    return this.props.name
  }

  get address() {
    return this.props.address
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

  get returnedAt() {
    return this.props.returnedAt
  }

  get recipientId() {
    return this.props.recipientId
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
    return true
  }

  return() {
    if (this.status !== OrderStatus.DELIVERED) return
    this.props.status = OrderStatus.RETURNED
    this.props.returnedAt = new Date()
  }

  toJson() {
    return {
      id: this.id.toString(),
      name: this.name,
      address: this.address.toJson(),
      deliveryAt: this.deliveryAt?.toISOString(),
      postageAt: this.postageAt.toISOString(),
      status: this.status,
      shippedAt: this.shippedAt?.toISOString(),
      shippedBy: this.shippedBy?.toString(),
      deliveryBy: this.deliveryBy?.toString(),
      photoURL: this.photoURL,
      returnedAt: this.returnedAt?.toISOString(),
      recipientId: this.recipientId.toString(),
    }
  }
}
