import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  DeliveryDriver,
  DeliveryDriverProps,
} from '@/domain/delivery/enterprise/entities/delivery-driver'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaDeliveryDriverMapper } from '@/infra/database/mappers/prisma-delivery-driver.mapper'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class DeliveryDriverFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async make(
    override: Partial<DeliveryDriverProps> = {},
    id?: UniqueEntityId,
  ): Promise<DeliveryDriver> {
    const DeliveryDriver = makeDeliveryDriver(override, id)

    const data = PrismaDeliveryDriverMapper.toPersistence(DeliveryDriver)
    await this.prismaService.user.create({ data })

    return DeliveryDriver
  }
}
