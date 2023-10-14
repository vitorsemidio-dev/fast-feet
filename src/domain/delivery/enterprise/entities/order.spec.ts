import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAddress } from 'test/factories/address.factory'
import { fakerPtBr } from 'test/utils/faker'
import { Order, OrderProps, OrderStatus } from './order'
import { Address } from './value-objects/address'

const makeSutInput = (
  overrider: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) => {
  const address = makeAddress()
  const props = {
    name: fakerPtBr.name.fullName(),
    recipientId: new UniqueEntityId(),
    address,
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

  it('should be able to create new order with "recipientId" provided', () => {
    const { props } = makeSutInput({
      recipientId: new UniqueEntityId('recipient-id'),
    })
    const sut = Order.create(props)
    expect(sut.recipientId).toBeDefined()
    expect(sut.recipientId).toBeInstanceOf(UniqueEntityId)
    expect(sut.recipientId.toString()).toEqual('recipient-id')
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

  it('should be able to set "address" with address provided', () => {
    const address = makeAddress({
      CEP: 'CEP',
      city: 'city',
      complement: 'complement',
      country: 'country',
      neighborhood: 'neighborhood',
      number: 'number',
      state: 'state',
      street: 'street',
    })
    const { props } = makeSutInput({
      address,
    })
    const sut = Order.create(props)
    expect(sut.address).toBeDefined()
    expect(sut.address).toBeInstanceOf(Address)
    expect(sut.address.CEP).toEqual('CEP')
    expect(sut.address.city).toEqual('city')
    expect(sut.address.complement).toEqual('complement')
    expect(sut.address.country).toEqual('country')
    expect(sut.address.neighborhood).toEqual('neighborhood')
    expect(sut.address.number).toEqual('number')
    expect(sut.address.state).toEqual('state')
    expect(sut.address.street).toEqual('street')
  })

  describe('set status "SHIPPED"', () => {
    it('should be able to set status "SHIPPED" when call "ship"', () => {
      const { props } = makeSutInput()
      const sut = Order.create(props)
      sut.ship(new UniqueEntityId('delivery-driver-id'))
      expect(sut.status).toEqual(OrderStatus.SHIPPED)
    })

    it('should be able to set "shippedAt" when call "ship"', () => {
      const { props } = makeSutInput()
      const sut = Order.create(props)
      sut.ship(new UniqueEntityId('delivery-driver-id'))
      expect(sut.shippedAt).toBeDefined()
      expect(sut.shippedAt).toBeInstanceOf(Date)
    })

    it('should be able to set "shippedBy" with delivery driver id', () => {
      const { props } = makeSutInput()
      const sut = Order.create(props)
      sut.ship(new UniqueEntityId('delivery-driver-id'))
      expect(sut.shippedBy).toBeDefined()
      expect(sut.shippedBy).toBeInstanceOf(UniqueEntityId)
      expect(sut.shippedBy?.toString()).toEqual('delivery-driver-id')
    })
  })

  describe('set status "DELIVERED"', () => {
    const _makeSutInput = (
      overrider: Partial<OrderProps> = {},
      id?: UniqueEntityId,
    ) => {
      return makeSutInput(
        {
          shippedBy: new UniqueEntityId('delivery-driver-id'),
          status: OrderStatus.SHIPPED,
          ...overrider,
        },
        id,
      )
    }
    it('should be able to set status "DELIVERED" when call "delivery"', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), 'any_url')
      expect(sut.status).toEqual(OrderStatus.DELIVERED)
    })

    it('should not be able to set status "DELIVERED" if current status is "PENDING"', () => {
      const { props } = _makeSutInput({
        status: OrderStatus.PENDING,
      })
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), 'any_url')
      expect(sut.status).toEqual(OrderStatus.PENDING)
      expect(sut.deliveryAt).toBeUndefined()
      expect(sut.deliveryBy).toBeUndefined()
    })

    it('should be able to set status "DELIVERED" only if current status is "SHIPPED"', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), 'any_url')
      expect(sut.status).toEqual(OrderStatus.DELIVERED)
      expect(sut.deliveryAt).toBeDefined()
      expect(sut.deliveryBy).toBeDefined()
    })

    it('should be able to set status "DELIVERED" only if provide photo_url', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      const fakePhotoURL = fakerPtBr.internet.url()
      sut.delivery(new UniqueEntityId('delivery-driver-id'), fakePhotoURL)
      expect(sut.photoURL).toBeDefined()
      expect(sut.photoURL).toEqual(fakePhotoURL)
    })

    it('should not be able to set status "DELIVERED" if no provide photo_url', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), null as any)
      expect(sut.status).toEqual(OrderStatus.SHIPPED)
      expect(sut.status).not.toEqual(OrderStatus.DELIVERED)
    })

    it('should not be able to set status "DELIVERED" if no provide deliveryBy', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      const fakePhotoURL = fakerPtBr.internet.url()
      sut.delivery(null as any, fakePhotoURL)
      expect(sut.status).toEqual(OrderStatus.SHIPPED)
      expect(sut.status).not.toEqual(OrderStatus.DELIVERED)
    })

    it('should be able to return order instance', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), 'any_url')
      expect(sut.deliveryAt).toBeDefined()
      expect(sut.deliveryAt).toBeInstanceOf(Date)
    })
    it('should be able to set "deliveryBy" with delivery driver id', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), 'any_url')
      expect(sut.deliveryBy).toBeDefined()
      expect(sut.deliveryBy).toBeInstanceOf(UniqueEntityId)
      expect(sut.deliveryBy?.toString()).toEqual('delivery-driver-id')
    })

    it('should be able to validate if shippedBy is the same deliveryBy', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.delivery(new UniqueEntityId('delivery-driver-id'), 'any_url')
      expect(sut.deliveryBy).toBeDefined()
      expect(sut.shippedBy).toBeDefined()
      expect(sut.deliveryBy?.toString()).toEqual(sut.shippedBy?.toString())
    })
  })

  describe('set status "RETURNED"', () => {
    const _makeSutInput = (
      overrider: Partial<OrderProps> = {},
      id?: UniqueEntityId,
    ) => {
      return makeSutInput(
        {
          status: OrderStatus.DELIVERED,
          ...overrider,
        },
        id,
      )
    }
    it('should be able to set status "RETURNED" when call "return"', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.return()
      expect(sut.status).toEqual(OrderStatus.RETURNED)
    })

    it('should be able to fill "returnedAt" when call "return"', () => {
      const { props } = _makeSutInput()
      const sut = Order.create(props)
      sut.return()
      expect(sut.returnedAt).toBeDefined()
      expect(sut.returnedAt).toBeInstanceOf(Date)
    })

    it('should be able to set status "RETURNED" only if current status is "DELIVERED"', () => {
      const { props } = _makeSutInput({
        status: OrderStatus.DELIVERED,
      })
      const sut = Order.create(props)
      sut.return()
      expect(sut.status).toEqual(OrderStatus.RETURNED)
      expect(sut.returnedAt).toBeDefined()
    })

    it('should not be able to set status "RETURNED" if current status is "PENDING"', () => {
      const { props } = _makeSutInput({
        status: OrderStatus.PENDING,
      })
      const sut = Order.create(props)
      sut.return()
      expect(sut.status).toEqual(OrderStatus.PENDING)
      expect(sut.returnedAt).toBeUndefined()
    })
  })
})
