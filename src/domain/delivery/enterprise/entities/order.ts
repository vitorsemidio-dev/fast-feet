import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidDeliveryUpdateError } from '@/domain/delivery/application/use-cases/errors/invalid-delivery-update.error'
import { InvalidOrderStatusUpdateError } from '@/domain/delivery/application/use-cases/errors/invalid-order-status-update.error'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'

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

export type DeliveryMethodReturnType = Either<
  InvalidOrderStatusUpdateError | InvalidDeliveryUpdateError,
  void
>

export type ReturnMethodReturnType = Either<InvalidOrderStatusUpdateError, void>

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

  delivery(
    deliveryBy: UniqueEntityId,
    photoURL: string,
  ): DeliveryMethodReturnType {
    if (this.status !== OrderStatus.SHIPPED) {
      return left(
        new InvalidOrderStatusUpdateError(
          `Order ${this.id.toString()} is not shipped. Cannot be delivered. Current status: ${
            this.status
          }`,
        ),
      )
    }
    if (!deliveryBy || !photoURL) {
      return left(
        new InvalidOrderStatusUpdateError(
          `Missing params: deliveryBy, photoURL`,
        ),
      )
    }
    if (deliveryBy.toString() !== this.shippedBy?.toString()) {
      return left(
        new InvalidDeliveryUpdateError(
          `Order ${this.id} is not shipped by ${deliveryBy}. Cannot be delivered. Current driver: ${this.shippedBy}`,
        ),
      )
    }
    this.props.status = OrderStatus.DELIVERED
    this.props.deliveryAt = new Date()
    this.props.deliveryBy = deliveryBy
    this.props.photoURL = photoURL
    return right(undefined)
  }

  return(): ReturnMethodReturnType {
    if (this.status !== OrderStatus.DELIVERED) {
      return left(
        new InvalidOrderStatusUpdateError(
          `Order ${this.id.toString()} is not delivered. Cannot be returned. Current status: ${
            this.status
          }`,
        ),
      )
    }
    this.props.status = OrderStatus.RETURNED
    this.props.returnedAt = new Date()
    return right(undefined)
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
