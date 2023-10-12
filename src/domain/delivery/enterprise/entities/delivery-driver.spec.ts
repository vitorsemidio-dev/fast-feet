import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { Role } from '@prisma/client'
import { CPF } from './value-objects/cpf'

describe('DeliveryDriver', () => {
  it('should be able to create new deliverydriver', () => {
    const deliverydriver = DeliveryDriver.create({
      cpf: CPF.makeRandom(),
      name: 'DeliveryDriver',
      password: '123456',
    })
    expect(deliverydriver).toBeDefined()
  })

  it('should be able to generate id when create new deliverydriver', () => {
    const deliverydriver = DeliveryDriver.create({
      cpf: CPF.makeRandom(),
      name: 'Delivery Driver',
      password: '123456',
    })
    expect(deliverydriver.id).toBeDefined()
    expect(deliverydriver.id.toString()).toBeDefined()
  })

  it('should be able to provide id when create new deliverydriver', () => {
    const deliverydriver = DeliveryDriver.create(
      {
        cpf: CPF.makeRandom(),
        name: 'Delivery Driver',
        password: '123456',
      },
      new UniqueEntityId('delivery-driver-id'),
    )
    expect(deliverydriver.id.toString()).toEqual('delivery-driver-id')
  })

  it('should be able to call toJson method', () => {
    const cpf = CPF.makeRandom()
    const deliverydriver = DeliveryDriver.create(
      {
        cpf,
        name: 'Delivery Driver',
        password: '123456',
      },
      new UniqueEntityId('delivery-driver-id'),
    )
    const expected = expect.objectContaining({
      id: 'delivery-driver-id',
      cpf: cpf.value,
      name: 'Delivery Driver',
      password: '123456',
      role: Role.DELIVERY_DRIVER,
    })
    expect(deliverydriver.toJson()).toEqual(expected)
  })

  it('should automatically assign the "DELIVERY_DRIVER" role when creating a new delivery driver user', () => {
    const deliverydriver = DeliveryDriver.create({
      cpf: CPF.makeRandom(),
      name: 'Delivery Driver',
      password: '123456',
    })
    expect(deliverydriver.role).toEqual(Roles.DELIVERY_DRIVER)
  })
})
