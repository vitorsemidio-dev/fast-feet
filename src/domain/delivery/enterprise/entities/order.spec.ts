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

  it('should be able to provide id when create new order', () => {
    const { props, id } = makeSutInput({}, new UniqueEntityId('order-id'))
    const sut = Order.create(props, id)
    expect(sut.id.toString()).toEqual('order-id')
  })

  it('should be able to generate id when create new order', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    expect(sut.id.toString()).toBeDefined()
  })

  it('should be able to fill "postageAt" when create new order', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    expect(sut.postageAt).toBeDefined()
    expect(sut.postageAt.toISOString()).toEqual(new Date().toISOString())
  })
})
