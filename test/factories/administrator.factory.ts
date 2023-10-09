import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/delivery/enterprise/entities/administrator'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { fakerPtBr } from 'test/utils/faker'

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityId,
): Administrator {
  const administrator = Administrator.create(
    {
      name: fakerPtBr.name.fullName(),
      password: fakerPtBr.internet.password(),
      cpf: override.cpf ?? CPF.makeRandom(),
      ...override,
    },
    id,
  )

  return administrator
}
