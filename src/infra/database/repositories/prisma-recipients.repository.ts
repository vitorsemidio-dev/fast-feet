import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prismaService.user.findUnique({
      where: { cpf, role: UserRoles.RECIPIENT },
    })

    if (!recipient) return null

    return recipient as any
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prismaService.user.findUnique({
      where: { id, role: UserRoles.RECIPIENT },
    })

    if (!recipient) return null

    return recipient as any
  }
}
