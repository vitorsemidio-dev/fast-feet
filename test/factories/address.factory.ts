import {
  Address,
  AddressProps,
} from '@/domain/delivery/enterprise/entities/value-objects/address'
import { fakerPtBr } from 'test/utils/faker'

export function makeAddress(override: Partial<AddressProps> = {}): Address {
  const address = Address.create({
    CEP: fakerPtBr.address.zipCode(),
    city: fakerPtBr.address.city(),
    complement: fakerPtBr.address.street(),
    country: fakerPtBr.address.country(),
    neighborhood: fakerPtBr.address.streetName(),
    number: fakerPtBr.address.street(),
    state: fakerPtBr.address.state(),
    street: fakerPtBr.address.streetName(),
    ...override,
  })

  return address
}
