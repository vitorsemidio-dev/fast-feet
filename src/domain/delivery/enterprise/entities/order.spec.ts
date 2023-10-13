import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { fakerPtBr } from 'test/utils/faker'
import { Order, OrderProps, OrderStatus } from './order'

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
    expect(sut.postageAt).toBeInstanceOf(Date)
  })

  it('should be able to set status "PENDING" when create new order', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    expect(sut.status).toEqual(OrderStatus.PENDING)
  })

  it('should be able to set status "SENDED" when call "send"', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    sut.send(new UniqueEntityId('delivery-driver-id'))
    expect(sut.status).toEqual(OrderStatus.SENDED)
  })

  it('should be able to set "sendedAt" when call "send"', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    sut.send(new UniqueEntityId('delivery-driver-id'))
    expect(sut.sendedAt).toBeDefined()
    expect(sut.sendedAt).toBeInstanceOf(Date)
  })

  it('should be able to set "sendedBy" with delivery driver id', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    sut.send(new UniqueEntityId('delivery-driver-id'))
    expect(sut.sendedBy).toBeDefined()
    expect(sut.sendedBy).toBeInstanceOf(UniqueEntityId)
    expect(sut.sendedBy?.toString()).toEqual('delivery-driver-id')
  })

  it('should be able to set status "DELIVERED" when call "delivery"', () => {
    const { props } = makeSutInput()
    const sut = Order.create(props)
    sut.delivery()
    expect(sut.status).toEqual(OrderStatus.DELIVERED)
  })
})
