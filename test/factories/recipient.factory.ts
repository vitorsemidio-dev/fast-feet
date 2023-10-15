import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaRecipientMapper } from '@/infra/database/mappers/prisma-recipient.mapper'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class RecipientFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async make(
    override: Partial<RecipientProps> = {},
    id?: UniqueEntityId,
  ): Promise<Recipient> {
    const recipient = makeRecipient(override, id)

    const data = PrismaRecipientMapper.toPersistence(recipient)
    await this.prismaService.user.create({ data })

    return recipient
  }
}
