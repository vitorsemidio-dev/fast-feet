import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'

export abstract class AdministratorsRepository {
  abstract create(administrator: Administrator): Promise<void>
  abstract findByCPF(cpf: string): Promise<Administrator | null>
}
