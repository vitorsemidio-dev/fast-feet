import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { CreateOrderBody } from '@/infra/http/controllers/create-order.controller'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAddress } from 'test/factories/address.factory'
import { RecipientFactory } from 'test/factories/recipient.factory'
import { TokenFactory } from 'test/factories/token.factory'
import { fakerPtBr } from 'test/utils/faker'

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
    complement: address.complement!,
    ...override,
  }
}

describe('CreateOrdersController (E2E)', () => {
  // Depedencies
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let tokenFactory: TokenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [RecipientFactory, TokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    tokenFactory = moduleRef.get(TokenFactory)

    await app.init()
  })

  const controller = '/orders'

  describe(`[POST] ${controller}`, () => {
    // Shared variables
    let recipient: Recipient
    let token: string
    let input: CreateOrderBody

    beforeAll(async () => {
      recipient = await recipientFactory.make()

      token = await tokenFactory.make({
        role: UserRoles.ADMINISTRATOR,
      })
    })

    beforeEach(async () => {
      input = makeRequestBody()
      input.recipientId = recipient.id.toString()
    })

    it('should return status code 201 when create', async () => {
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(201)
    })

    it('should return status code 404 when not found recipient', async () => {
      const recipientIdNotFound = new UniqueEntityId().toString()
      input.recipientId = recipientIdNotFound
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(404)
    })

    it('should not return status code 404 when controller is register', async () => {
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).not.toBe(404)
    })

    it('should persiste data on database', async () => {
      input.name = new UniqueEntityId().toString()
      input.city = 'My City Test'
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
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
      expect(orderOnDB?.recipientId).toEqual(input.recipientId)
      expect(orderOnDB?.city).toEqual('My City Test')
    })

    it('should return status code 401 when user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`${controller}`)
        .send(input)

      expect(response.statusCode).toBe(401)
    })

    it('should return status code 403 when authenticate user is RECIPIENT', async () => {
      token = await tokenFactory.make({
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
