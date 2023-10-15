import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAddress } from 'test/factories/address.factory'
import { makeAdministrator } from 'test/factories/administrator.factory'
import { fakerPtBr } from 'test/utils/faker'
import { CreateOrderBody } from './create-order.controller'

const makeRequestBody = (
  override: Partial<CreateOrderBody> = {},
): CreateOrderBody => {
  const address = makeAddress()
  return {
    recipientId: new UniqueEntityId().toString(),
    name: fakerPtBr.name.fullName(),
    CEP: address.CEP,
    city: address.city,
    country: address.country,
    neighborhood: address.neighborhood,
    number: address.number,
    state: address.state,
    street: address.street,
    complement: address.complement,
    ...override,
  }
}

describe('CreateOrdersController (E2E)', () => {
  // Depedencies
  let app: INestApplication
  let prisma: PrismaService
  let jwtEncrypter: Encrypter

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwtEncrypter = moduleRef.get(Encrypter)

    await app.init()
  })

  // Shared variables
  let administrator: Administrator
  let token: string

  beforeEach(async () => {
    administrator = makeAdministrator()
    token = await jwtEncrypter.encrypt({
      sub: administrator.id.toString(),
      role: UserRoles.ADMINISTRATOR,
    })
  })

  describe('[POST] /orders', () => {
    let input: CreateOrderBody

    beforeEach(async () => {
      administrator = makeAdministrator()
      token = await jwtEncrypter.encrypt({
        sub: administrator.id.toString(),
        role: UserRoles.ADMINISTRATOR,
      })
      input = makeRequestBody()
    })

    it.skip('should return status code 201 when create', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(201)
    })

    it.only('should return status code 404 when not found recipient', async () => {
      const recipientIdNotFound = new UniqueEntityId().toString()
      input.recipientId = recipientIdNotFound
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(404)
    })

    it('should not return status code 404 when controller is register', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).not.toBe(404)
    })

    it('should persiste data on database', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      // const userOnDatabase = await prisma.user.findUnique({
      //   where: {
      //     cpf: input.cpf,
      //   },
      // })

      // expect(userOnDatabase).toBeTruthy()
      // expect(userOnDatabase?.name).toEqual(input.name)
      // expect(userOnDatabase?.cpf).toEqual(input.cpf)
      // expect(userOnDatabase?.role).toEqual(UserRoles.DELIVERY_DRIVER)
      // expect(userOnDatabase?.password).not.toEqual(input.password)
    })

    it('should return status code 409 when cpf already exists', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(409)
    })

    it('should return status code 401 when user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(input)

      expect(response.statusCode).toBe(401)
    })

    it('should return status code 403 when authenticate user is RECIPIENT', async () => {
      token = await jwtEncrypter.encrypt({
        sub: administrator.id.toString(),
        role: UserRoles.RECIPIENT,
      })

      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })

    it('should return status code 403 when authenticate user is DELIVERY_DRIVER', async () => {
      token = await jwtEncrypter.encrypt({
        sub: administrator.id.toString(),
        role: UserRoles.DELIVERY_DRIVER,
      })
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })
  })
})
