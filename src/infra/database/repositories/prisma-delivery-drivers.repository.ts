import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { Injectable } from '@nestjs/common'
import { PrismaDeliveryDriverMapper } from '../mappers/prisma-delivery-driver.mapper'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PrismaDeliveryDriversRepository
  implements DeliveryDriversRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(deliveryDriver: DeliveryDriver): Promise<void> {
    const data = PrismaDeliveryDriverMapper.toPersistence(deliveryDriver)

    await this.prismaService.user.create({
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    })
  }

  async findByCPF(cpf: string): Promise<DeliveryDriver | null> {
    const result = await this.prismaService.user.findUnique({
      where: {
        cpf,
        role: Roles.DELIVERY_DRIVER,
      },
    })

    if (!result) {
      return null
    }

    return PrismaDeliveryDriverMapper.toDomain(result)
  }

  async findById(id: string): Promise<DeliveryDriver | null> {
    const result = await this.prismaService.user.findUnique({
      where: {
        id,
        role: Roles.DELIVERY_DRIVER,
      },
    })

    if (!result) {
      return null
    }

    return PrismaDeliveryDriverMapper.toDomain(result)
  }

  async findMany(): Promise<DeliveryDriver[]> {
    const result = await this.prismaService.user.findMany({
      where: {
        role: Roles.DELIVERY_DRIVER,
      },
    })

    return result.map(PrismaDeliveryDriverMapper.toDomain)
  }

  async update(deliveryDriver: DeliveryDriver): Promise<void> {
    const data = PrismaDeliveryDriverMapper.toPersistence(deliveryDriver)

    await this.prismaService.user.update({
      where: {
        id: deliveryDriver.id.toString(),
        role: Roles.DELIVERY_DRIVER,
      },
      data,
    })
  }
}
