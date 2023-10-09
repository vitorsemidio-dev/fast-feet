import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'

export class InMemoryAdministratorsRepository
  implements AdministratorsRepository
{
  itens: Administrator[] = []
  async create(administrator: Administrator): Promise<void> {
    this.itens.push(administrator)
  }

  async findByCPF(cpf: string): Promise<Administrator | null> {
    return this.itens.find((item) => item.cpf.value === cpf) ?? null
  }
}
