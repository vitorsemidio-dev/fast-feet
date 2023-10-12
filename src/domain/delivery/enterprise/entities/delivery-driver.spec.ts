import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  DeliveryDriver,
  DeliveryDriverProps,
} from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { Role } from '@prisma/client'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'

const makeSutInput = (
  override: Partial<DeliveryDriverProps> = {},
  _id?: UniqueEntityId,
) => {
  const deliveryDriver = makeDeliveryDriver(override, _id)
  const props = {
    cpf: deliveryDriver.cpf,
    name: deliveryDriver.name,
    password: deliveryDriver.password,
    role: deliveryDriver.role,
  }
  const id = deliveryDriver.id
  return {
    props,
    id,
  }
}

describe('DeliveryDriver', () => {
  it('should be able to create new delivery driver', () => {
    const { props } = makeSutInput()
    const deliveryDriver = DeliveryDriver.create(props)
    expect(deliveryDriver).toBeDefined()
  })

  it('should be able to generate id when create new delivery driver', () => {
    const { props } = makeSutInput()
    const deliveryDriver = DeliveryDriver.create(props)
    expect(deliveryDriver.id).toBeDefined()
    expect(deliveryDriver.id.toString()).toBeDefined()
  })

  it('should be able to provide id when create new delivery driver', () => {
    const { props, id } = makeSutInput(
      {},
      new UniqueEntityId('delivery-driver-id'),
    )
    const deliveryDriver = DeliveryDriver.create(props, id)
    expect(deliveryDriver.id.toString()).toEqual('delivery-driver-id')
  })

  it('should be able to call toJson method', () => {
    const { props } = makeSutInput()
    const deliveryDriver = DeliveryDriver.create(
      props,
      new UniqueEntityId('delivery-driver-id'),
    )
    const expected = expect.objectContaining({
      id: 'delivery-driver-id',
      cpf: props.cpf.value,
      name: props.name,
      password: props.password,
      role: Role.DELIVERY_DRIVER,
    })
    expect(deliveryDriver.toJson()).toEqual(expected)
  })

  it('should automatically assign the "DELIVERY_DRIVER" role when creating a new delivery driver user', () => {
    const { props } = makeSutInput()
    const deliveryDriver = DeliveryDriver.create(props)
    expect(deliveryDriver.role).toEqual(Roles.DELIVERY_DRIVER)
  })
})
