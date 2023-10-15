import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaDeliveryDriver } from '@prisma/client'

export class PrismaDeliveryDriverMapper {
  static toDomain(raw: PrismaDeliveryDriver): DeliveryDriver {
    return DeliveryDriver.create(
      {
        cpf: CPF.create(raw.cpf),
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(data: DeliveryDriver): Prisma.UserUncheckedCreateInput {
    return {
      cpf: data.cpf.value,
      name: data.name,
      password: data.password,
      role: data.role,
      id: data.id.toString(),
    }
  }
}
