import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
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
  }
}

const makeSutInput = (
  overrider: Partial<ChangeOrderStatusToShippedUseCaseInput> = {},
) => {
  return {
    orderId: new UniqueEntityId().toString(),
    ...overrider,
  }
}

describe('ChangeOrderStatusToShippedUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should return ResourceNotFoundError if order does not exists', async () => {
    const { sut } = makeSut()
    const input = makeSutInput()

    const result = await sut.execute(input)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.isLeft()).toBeTruthy()
  })
})
