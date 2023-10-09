import { AdministratorsRepository } from '@/core/repositories/administrators.repositories'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { Injectable } from '@nestjs/common'
import { PrismaAdministratorMapper } from '../mappers/prisma-adminisitrator.mapper'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PrismaAdministratorsRepository
  implements AdministratorsRepository
{
  constructor(private readonly prismaService: PrismaService) {}
  async create(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPersistence(administrator)
    await this.prismaService.user.create({ data })
  }
}
