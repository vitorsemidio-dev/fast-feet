import { AdministratorsRepository } from '@/core/repositories/administrators.repository'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { PrismaAdministratorMapper } from '@/infra/database/mappers/prisma-adminisitrator.mapper'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAdministratorsRepository
  implements AdministratorsRepository
{
  constructor(private readonly prismaService: PrismaService) {}
  async create(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPersistence(administrator)
    await this.prismaService.user.create({ data })
  }

  async findByCPF(cpf: string): Promise<Administrator | null> {
    const result = await this.prismaService.user.findUnique({
      where: {
        cpf,
      },
    })

    return result ? PrismaAdministratorMapper.toDomain(result) : null
  }
}
