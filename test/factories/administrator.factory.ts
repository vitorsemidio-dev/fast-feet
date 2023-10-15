import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/delivery/enterprise/entities/administrator'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaAdministratorMapper } from '@/infra/database/mappers/prisma-adminisitrator.mapper'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { fakerPtBr } from 'test/utils/faker'

export function makeAdministrator(
  override: Partial<AdministratorProps> | Administrator = {},
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

@Injectable()
export class AdministratorFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async make(
    override: Partial<AdministratorProps> = {},
    id?: UniqueEntityId,
  ): Promise<Administrator> {
    const administrator = makeAdministrator(override, id)

    const data = PrismaAdministratorMapper.toPersistence(administrator)
    await this.prismaService.user.create({ data })

    return administrator
  }
}
