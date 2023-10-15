import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PrismaDeliveryDriversRepository
  implements DeliveryDriversRepository
{
  constructor(private readonly prismaService: PrismaService) {}
  create(deliveryDriver: DeliveryDriver): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findByCPF(cpf: string): Promise<DeliveryDriver | null> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<DeliveryDriver | null> {
    throw new Error('Method not implemented.')
  }
  findMany(): Promise<DeliveryDriver[]> {
    throw new Error('Method not implemented.')
  }
  update(deliveryDriver: DeliveryDriver): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
