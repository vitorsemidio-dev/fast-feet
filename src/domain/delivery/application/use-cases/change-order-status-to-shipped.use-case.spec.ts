import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/order.factory'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { OrderStatus } from '../../enterprise/entities/order'
import {
  ChangeOrderStatusToShippedUseCase,
  ChangeOrderStatusToShippedUseCaseInput,
} from './change-order-status-to-shipped.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const ordersRepository = new InMemoryOrdersRepository()
  const sut = new ChangeOrderStatusToShippedUseCase(ordersRepository)
  return {
    sut,
    ordersRepository,
  }
}

const makeSutInput = (
  overrider: Partial<ChangeOrderStatusToShippedUseCaseInput> = {},
) => {
  return {
    orderId: new UniqueEntityId().toString(),
    deliveryDriverId: new UniqueEntityId().toString(),
    ...overrider,
  }
}

describe('ChangeOrderStatusToShippedUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should be able to change order status to shipped', async () => {
    const { sut, ordersRepository } = makeSut()
    const order = makeOrder()
    await ordersRepository.create(order)
    const input = makeSutInput({
      orderId: order.id.toString(),
      deliveryDriverId: new UniqueEntityId('ship').toString(),
    })

    await sut.execute(input)

    const orderOnDB = await ordersRepository.findById(order.id.toString())

    expect(orderOnDB?.status).toEqual(OrderStatus.SHIPPED)
    expect(orderOnDB?.shippedAt).toBeDefined()
    expect(orderOnDB?.shippedBy?.toString()).toEqual('ship')
  })

  it('should return ResourceNotFoundError if order does not exists', async () => {
    const { sut } = makeSut()
    const input = makeSutInput()

    const result = await sut.execute(input)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.isLeft()).toBeTruthy()
  })
})
