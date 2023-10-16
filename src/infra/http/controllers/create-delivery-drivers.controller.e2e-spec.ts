import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdministrator } from 'test/factories/administrator.factory'
import { TokenFactory } from 'test/factories/token.factory'
import { fakerPtBr } from 'test/utils/faker'
import { CreateDeliveryDriverBody } from './create-delivery-drivers.controller'

const makeRequestBody = (
  override: Partial<CreateDeliveryDriverBody> = {},
): CreateDeliveryDriverBody => {
  return {
    cpf: CPF.makeRandom().value,
    name: fakerPtBr.name.fullName(),
    password: fakerPtBr.internet.password(),
    ...override,
  }
}

describe('CreateDeliveryDriversController (E2E)', () => {
  // Depedencies
  let app: INestApplication
  let prisma: PrismaService
  let tokenFactory: TokenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [TokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    tokenFactory = moduleRef.get(TokenFactory)

    await app.init()
  })

  // Shared variables
  let administrator: Administrator
  let token: string
  const controller = '/delivery-drivers'

  beforeEach(async () => {
    administrator = makeAdministrator()
    token = await tokenFactory.make({
      sub: administrator.id.toString(),
      role: UserRoles.ADMINISTRATOR,
    })
  })

  describe(`[POST] ${controller}`, () => {
    let input: CreateDeliveryDriverBody

    beforeEach(async () => {
      administrator = makeAdministrator()
      token = await tokenFactory.make({
        sub: administrator.id.toString(),
        role: UserRoles.ADMINISTRATOR,
      })
      input = makeRequestBody()
    })

    it('should return status code 201 when create', async () => {
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(201)
    })

    it('should persiste data on database', async () => {
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      const userOnDatabase = await prisma.user.findUnique({
        where: {
          cpf: input.cpf,
        },
      })

      expect(userOnDatabase).toBeTruthy()
      expect(userOnDatabase?.name).toEqual(input.name)
      expect(userOnDatabase?.cpf).toEqual(input.cpf)
      expect(userOnDatabase?.role).toEqual(UserRoles.DELIVERY_DRIVER)
      expect(userOnDatabase?.password).not.toEqual(input.password)
    })

    it('should return status code 409 when cpf already exists', async () => {
      await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(409)
    })

    it('should return status code 401 when user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .send(input)

      expect(response.statusCode).toBe(401)
    })

    it('should return status code 403 when authenticate user is RECIPIENT', async () => {
      token = await tokenFactory.make({
        sub: administrator.id.toString(),
        role: UserRoles.RECIPIENT,
      })

      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })

    it('should return status code 403 when authenticate user is DELIVERY_DRIVER', async () => {
      token = await tokenFactory.make({
        sub: administrator.id.toString(),
        role: UserRoles.DELIVERY_DRIVER,
      })
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })
  })
})
