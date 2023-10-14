import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/order.factory'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { fakerPtBr } from 'test/utils/faker'
import { Order, OrderStatus } from '../../enterprise/entities/order'
import {
  ChangeOrderStatusToDeliveredUseCase,
  ChangeOrderStatusToDeliveredUseCaseInput,
  ChangeOrderStatusToDeliveredUseCaseOutput,
} from './change-order-status-to-delivered.use-case'
import { InvalidDeliveryUpdateError } from './errors/invalid-delivery-update.error'
import { InvalidOrderStatusUpdateError } from './errors/invalid-order-status-update.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const ordersRepository = new InMemoryOrdersRepository()
  const sut = new ChangeOrderStatusToDeliveredUseCase(ordersRepository)
  return {
    sut,
    ordersRepository,
  }
}

const makeSutInput = (
  overrider: Partial<ChangeOrderStatusToDeliveredUseCaseInput> = {},
) => {
  return {
    orderId: new UniqueEntityId().toString(),
    deliveryDriverId: new UniqueEntityId().toString(),
    photoURL: fakerPtBr.image.imageUrl(),
    ...overrider,
  }
}

const getRight = (output: ChangeOrderStatusToDeliveredUseCaseOutput) => {
  if (output.isLeft()) {
    throw output.value
  }
  return output
}

describe('ChangeOrderStatusToDeliveredUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should be able to change order status to delivered', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder({
      status: OrderStatus.SHIPPED,
      shippedBy: new UniqueEntityId('delivery-driver-id'),
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
      deliveryDriverId: new UniqueEntityId('delivery-driver-id').toString(),
    })

    await sut.execute(input)

    const orderOnDB = await ordersRepository.findById(order.id.toString())

    expect(orderOnDB?.status).toEqual(OrderStatus.DELIVERED)
    expect(orderOnDB?.deliveryAt).toBeDefined()
    expect(orderOnDB?.deliveryBy?.toString()).toEqual('delivery-driver-id')
  })

  it('should return instance of Order updated', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder({
      status: OrderStatus.SHIPPED,
      shippedBy: new UniqueEntityId('delivery-driver-id'),
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
      deliveryDriverId: 'delivery-driver-id',
    })

    const output = await sut.execute(input)
    const { value } = getRight(output)

    expect(value.order).toBeInstanceOf(Order)
    expect(value.order?.status).toEqual(OrderStatus.DELIVERED)
  })

  it('should return ResourceNotFoundError if order does not exists', async () => {
    const { sut } = makeSut()
    const input = makeSutInput()

    const result = await sut.execute(input)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.isLeft()).toBeTruthy()
  })

  it('should return InvalidOrderStatusUpdateError if current status is "PENDING"', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder({
      status: OrderStatus.PENDING,
      shippedBy: new UniqueEntityId('delivery-driver-id'),
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
      deliveryDriverId: order.shippedBy?.toString()!,
    })

    const result = await sut.execute(input)

    expect(result.value).toBeInstanceOf(InvalidOrderStatusUpdateError)
    expect(result.isLeft()).toBeTruthy()
  })

  it('should return InvalidDeliveryUpdateError if delivery driver who delivered is not the same who shipped', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder({
      status: OrderStatus.PENDING,
      shippedBy: new UniqueEntityId('correct-delivery-driver-id'),
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
      deliveryDriverId: new UniqueEntityId(
        'wrong-delivery-driver-id',
      ).toString(),
    })

    const result = await sut.execute(input)

    expect(result.value).toBeInstanceOf(InvalidDeliveryUpdateError)
    expect(result.isLeft()).toBeTruthy()
  })
})
