import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { fakerPtBr } from 'test/utils/faker'

export function makeRecipient(
  override: Partial<RecipientProps> | Recipient = {},
  id?: UniqueEntityId,
): Recipient {
  const recipient = Recipient.create(
    {
      name: fakerPtBr.name.fullName(),
      password: fakerPtBr.internet.password(),
      cpf: override.cpf ?? CPF.makeRandom(),
      ...override,
    },
    id,
  )

  return recipient
}
