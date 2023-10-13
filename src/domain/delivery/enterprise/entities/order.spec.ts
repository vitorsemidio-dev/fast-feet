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

  describe('set status "SENDED"', () => {
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
  })

  describe('set status "DELIVERED"', () => {
    it('should be able to set status "DELIVERED" when call "delivery"', () => {
      const { props } = makeSutInput({
        sendedBy: new UniqueEntityId('delivery-driver-id'),
        status: OrderStatus.SENDED,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'))
      expect(sut.status).toEqual(OrderStatus.DELIVERED)
    })

    it('should not be able to set status "DELIVERED" if current status is "PENDING"', () => {
      const { props } = makeSutInput({
        sendedBy: new UniqueEntityId('delivery-driver-id'),
        status: OrderStatus.PENDING,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'))
      expect(sut.status).toEqual(OrderStatus.PENDING)
      expect(sut.deliveryAt).toBeUndefined()
      expect(sut.deliveryBy).toBeUndefined()
    })

    it('should be able to set status "DELIVERED" only if current status is "SENDED"', () => {
      const { props } = makeSutInput({
        sendedBy: new UniqueEntityId('delivery-driver-id'),
        status: OrderStatus.SENDED,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'))
      expect(sut.status).toEqual(OrderStatus.DELIVERED)
      expect(sut.deliveryAt).toBeDefined()
      expect(sut.deliveryBy).toBeDefined()
    })

    it('should be able to return order instance', () => {
      const { props } = makeSutInput({
        sendedBy: new UniqueEntityId('delivery-driver-id'),
        status: OrderStatus.SENDED,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'))
      expect(sut.deliveryAt).toBeDefined()
      expect(sut.deliveryAt).toBeInstanceOf(Date)
    })
    it('should be able to set "deliveryBy" with delivery driver id', () => {
      const { props } = makeSutInput({
        sendedBy: new UniqueEntityId('delivery-driver-id'),
        status: OrderStatus.SENDED,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'))
      expect(sut.deliveryBy).toBeDefined()
      expect(sut.deliveryBy).toBeInstanceOf(UniqueEntityId)
      expect(sut.deliveryBy?.toString()).toEqual('delivery-driver-id')
    })

    it('should be able to validate if sendedBy is the same deliveryBy', () => {
      const { props } = makeSutInput({
        sendedBy: new UniqueEntityId('delivery-driver-id'),
        status: OrderStatus.SENDED,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'))
      expect(sut.deliveryBy).toBeDefined()
      expect(sut.sendedBy).toBeDefined()
      expect(sut.deliveryBy?.toString()).toEqual(sut.sendedBy?.toString())
    })
  })
})
