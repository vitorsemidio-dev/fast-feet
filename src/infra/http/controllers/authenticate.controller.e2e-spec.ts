import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdministrator } from 'test/factories/administrator.factory'
import { fakerPtBr } from 'test/utils/faker'
import { AuthenticateBody } from './authenticate.controller'

const makeRequestBody = (
  override: Partial<AuthenticateBody> = {},
): AuthenticateBody => {
  return {
    cpf: CPF.makeRandom().value,
    password: fakerPtBr.internet.password(),
    ...override,
  }
}

describe('AuthenticateController (E2E)', () => {
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

  const controller = '/sessions'

  describe('[POST] /sessions', () => {
    const input = makeRequestBody()
    let response: request.Response

    beforeAll(async () => {
      const admin = makeAdministrator({
        cpf: CPF.create(input.cpf),
        password: input.password,
      }).toJson()

      const admRequest = {
        name: admin.name,
        cpf: admin.cpf.value,
        password: admin.password,
      }
      await request(app.getHttpServer())
        .post('/administrators')
        .send(admRequest)

      response = await request(app.getHttpServer())
        .post(`${controller}`)
        .send(input)
    })

    it('should return status code 201 when create', async () => {
      expect(response.statusCode).toBe(201)
    })

    it('should return access token', async () => {
      expect(response.body).toHaveProperty('accessToken')
    })
  })

  describe(`[POST] ${controller}`, () => {
    const input = makeRequestBody()
    input.cpf = 'wrong-cpf'
    input.password = 'wrong-password'

    let response: request.Response

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post(`${controller}`)
        .send(input)
    })

    it('should return status code 401 when provide wrong cpf', async () => {
      expect(response.statusCode).toBe(401)
    })

    it('should return status code 401 when provide wrong password', async () => {
      expect(response.statusCode).toBe(401)
    })

    it('should return status code 401 when provide cpf that does not exist', async () => {
      expect(response.statusCode).toBe(401)
    })
  })
})
