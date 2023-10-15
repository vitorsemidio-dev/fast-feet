import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        cpf: CPF.create(raw.cpf),
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(data: Recipient): Prisma.UserUncheckedCreateInput {
    return {
      cpf: data.cpf.value,
      name: data.name,
      password: data.password,
      role: data.role,
      id: data.id.toString(),
    }
  }
}
