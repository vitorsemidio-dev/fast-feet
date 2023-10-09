import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('CreateAdministratorUseCase', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /administrators', async () => {
    const input = {
      name: 'Administrator',
      password: '123456',
      cpf: CPF.makeRandom().value,
    }

    const response = await request(app.getHttpServer())
      .post('/administrators')
      .send(input)

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: input.cpf,
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.name).toEqual(input.name)
    expect(userOnDatabase?.cpf).toEqual(input.cpf)
    expect(userOnDatabase?.role).toEqual(Roles.ADMINISTRATOR)
    expect(userOnDatabase?.password).not.toEqual(input.password)
  })
})
