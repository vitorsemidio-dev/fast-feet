import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  itens: Recipient[] = []

  async findByCPF(cpf: string): Promise<Recipient | null> {
    return this.itens.find((item) => item.cpf.value === cpf) ?? null
  }

  async findById(id: string): Promise<Recipient | null> {
    return this.itens.find((item) => item.id.toString() === id) ?? null
  }
}
