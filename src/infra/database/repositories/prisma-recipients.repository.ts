import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findByCPF(cpf: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }
}
