import { DeliveryDriversRepository } from '@/core/repositories/delivery-drivers.repository'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'

export class InMemoryDeliveryDriversRepository
  implements DeliveryDriversRepository
{
  itens: DeliveryDriver[] = []
  async create(DeliveryDriver: DeliveryDriver): Promise<void> {
    this.itens.push(DeliveryDriver)
  }

  async delete(id: string): Promise<void> {
    this.itens = this.itens.filter((item) => item.id.toString() !== id)
  }

  async findByCPF(cpf: string): Promise<DeliveryDriver | null> {
    return this.itens.find((item) => item.cpf.value === cpf) ?? null
  }

  async findById(id: string): Promise<DeliveryDriver | null> {
    const item = this.itens.find((item) => item.id.toString() === id)
    if (!item) {
      return null
    }
    return item
  }

  async findMany(): Promise<DeliveryDriver[]> {
    return this.itens
  }

  async update(deliveryDriver: DeliveryDriver): Promise<void> {
    const index = this.itens.findIndex(
      (item) => item.id.toString() === deliveryDriver.id.toString(),
    )
    if (index === -1) {
      throw new Error('DeliveryDriver not found')
    }
    this.itens = this.itens.map((item) => {
      if (item.id.toString() === deliveryDriver.id.toString()) {
        return deliveryDriver
      }
      return item
    })
  }
}
