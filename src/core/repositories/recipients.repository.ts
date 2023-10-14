import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract findByCPF(cpf: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
}
