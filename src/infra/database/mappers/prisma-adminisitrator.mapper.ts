import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaAdministrator } from '@prisma/client'

export class PrismaAdministratorMapper {
  static toDomain(raw: PrismaAdministrator): Administrator {
    return Administrator.create(
      {
        cpf: CPF.create(raw.cpf),
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(data: Administrator): Prisma.UserUncheckedCreateInput {
    return {
      cpf: data.cpf.value,
      name: data.name,
      password: data.password,
      role: data.role,
      id: data.id.toString(),
    }
  }
}
