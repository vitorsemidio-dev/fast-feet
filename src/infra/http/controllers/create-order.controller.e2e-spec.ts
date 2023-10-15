import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAddress } from 'test/factories/address.factory'
import { makeAdministrator } from 'test/factories/administrator.factory'
import { makeRecipient } from 'test/factories/recipient.factory'
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

  describe('[POST] /orders', () => {
    // Shared variables
    let administrator: Administrator
    let recipient: Recipient
    let token: string
    let input: CreateOrderBody

    beforeAll(async () => {
      recipient = makeRecipient()
      await prisma.user.create({
        data: {
          id: recipient.id.toString(),
          name: recipient.name,
          cpf: recipient.cpf.value,
          password: recipient.password,
          role: recipient.role,
        },
      })

      administrator = makeAdministrator()
      token = await jwtEncrypter.encrypt({
        sub: administrator.id.toString(),
        role: UserRoles.ADMINISTRATOR,
      })
    })

    beforeEach(async () => {
      input = makeRequestBody()
      input.recipientId = recipient.id.toString()
    })

    it('should return status code 201 when create', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(201)
    })

    it('should return status code 404 when not found recipient', async () => {
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
      input.name = new UniqueEntityId().toString()
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      const orderOnDB = await prisma.order.findFirst({
        where: {
          name: input.name,
        },
      })

      expect(orderOnDB).toBeTruthy()
      expect(orderOnDB?.name).toEqual(input.name)
      expect(orderOnDB?.status).toEqual(OrderStatus.PENDING)
      expect(orderOnDB?.postageAt).toBeDefined()
      expect(orderOnDB?.id).toBeDefined()
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
