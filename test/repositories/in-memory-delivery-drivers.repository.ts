import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'

export class InMemoryDeliveryDriversRepository
  implements DeliveryDriversRepository
{
  itens: DeliveryDriver[] = []
  async create(DeliveryDriver: DeliveryDriver): Promise<void> {
    this.itens.push(DeliveryDriver)
  }

  async findByCPF(cpf: string): Promise<DeliveryDriver | null> {
    return this.itens.find((item) => item.cpf.value === cpf) ?? null
  }
}
