import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'

export abstract class DeliveryDriversRepository {
  abstract create(deliverydriver: DeliveryDriver): Promise<void>
  abstract findByCPF(cpf: string): Promise<DeliveryDriver | null>
}
