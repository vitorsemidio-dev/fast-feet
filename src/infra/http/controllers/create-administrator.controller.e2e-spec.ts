import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { fakerPtBr } from 'test/utils/faker'
import { CreateAdministratorBody } from './create-administrator.controller'

const makeRequestBody = (
  override: Partial<CreateAdministratorBody> = {},
): CreateAdministratorBody => {
  return {
    cpf: CPF.makeRandom().value,
    name: fakerPtBr.name.fullName(),
    password: fakerPtBr.internet.password(),
    ...override,
  }
}

describe('CreateAdministratorController (E2E)', () => {
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

  const controller = '/administrators'

  describe(`[POST] ${controller}`, () => {
    const input = makeRequestBody()
    let response: request.Response

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post(`${controller}`)
        .send(input)
    })

    it('should return status code 201 when create', async () => {
      expect(response.statusCode).toBe(201)
    })

    it('should persiste data on database', async () => {
      const userOnDatabase = await prisma.user.findUnique({
        where: {
          cpf: input.cpf,
        },
      })

      expect(userOnDatabase).toBeTruthy()
      expect(userOnDatabase?.name).toEqual(input.name)
      expect(userOnDatabase?.cpf).toEqual(input.cpf)
      expect(userOnDatabase?.role).toEqual(UserRoles.ADMINISTRATOR)
      expect(userOnDatabase?.password).not.toEqual(input.password)
    })
  })

  describe(`[POST] ${controller}`, () => {
    const input = makeRequestBody()
    let response: request.Response

    beforeAll(async () => {
      await request(app.getHttpServer()).post(`${controller}`).send(input)
      response = await request(app.getHttpServer())
        .post(`${controller}`)
        .send(input)
    })

    it('should return status codoe 409 when cpf already exists', async () => {
      expect(response.statusCode).toBe(409)
    })
  })
})
