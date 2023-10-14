import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/order.factory'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { Order, OrderStatus } from '../../enterprise/entities/order'
import {
  ChangeOrderStatusToReturnedUseCase,
  ChangeOrderStatusToReturnedUseCaseInput,
} from './change-order-status-to-returned.use-case'
import { InvalidOrderStatusUpdateError } from './errors/invalid-order-status-update.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const ordersRepository = new InMemoryOrdersRepository()
  const sut = new ChangeOrderStatusToReturnedUseCase(ordersRepository)
  return {
    sut,
    ordersRepository,
  }
}

const makeSutInput = (
  overrider: Partial<ChangeOrderStatusToReturnedUseCaseInput> = {},
) => {
  return {
    orderId: new UniqueEntityId().toString(),
    ...overrider,
  }
}

describe('ChangeOrderStatusToReturnedUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should be able to change order status to returned', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder({
      status: OrderStatus.DELIVERED,
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
    })

    await sut.execute(input)

    const orderOnDB = await ordersRepository.findById(order.id.toString())

    expect(orderOnDB?.status).toEqual(OrderStatus.RETURNED)
    expect(orderOnDB?.returnedAt).toBeDefined()
  })

  it('should return instance of Order updated', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder({
      status: OrderStatus.DELIVERED,
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
    })

    const output = await sut.execute(input)
    const value = output.getRight()

    expect(value.order).toBeInstanceOf(Order)
    expect(value.order?.status).toEqual(OrderStatus.RETURNED)
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
    })
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
    })

    const result = await sut.execute(input)

    expect(result.value).toBeInstanceOf(InvalidOrderStatusUpdateError)
    expect(result.isLeft()).toBeTruthy()
  })
})
