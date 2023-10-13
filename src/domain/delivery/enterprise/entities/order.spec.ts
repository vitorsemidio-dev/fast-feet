import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { fakerPtBr } from 'test/utils/faker'
import { Order, OrderProps } from './order'

const makeSutInput = (
  overrider: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) => {
  const props = {
    name: fakerPtBr.name.fullName(),
    ...overrider,
  }
  return {
    props,
    id: id ?? new UniqueEntityId(),
  }
}

describe('Order', () => {
  it('should be able to create new order', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    expect(sut).toBeDefined()
  })
})
