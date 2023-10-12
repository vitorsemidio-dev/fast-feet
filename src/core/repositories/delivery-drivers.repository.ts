import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'

export abstract class DeliveryDriversRepository {
  abstract create(deliveryDriver: DeliveryDriver): Promise<void>
  abstract findByCPF(cpf: string): Promise<DeliveryDriver | null>
  abstract findMany(): Promise<DeliveryDriver[]>
}
