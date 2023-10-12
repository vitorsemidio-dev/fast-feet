import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  DeliveryDriver,
  DeliveryDriverProps,
} from '@/domain/delivery/enterprise/entities/delivery-driver'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { fakerPtBr } from 'test/utils/faker'

export function makeDeliveryDriver(
  override: Partial<DeliveryDriverProps> | DeliveryDriver = {},
  id?: UniqueEntityId,
): DeliveryDriver {
  const deliveryDriver = DeliveryDriver.create(
    {
      name: fakerPtBr.name.fullName(),
      password: fakerPtBr.internet.password(),
      cpf: override.cpf ?? CPF.makeRandom(),
      ...override,
    },
    id,
  )

  return deliveryDriver
}
