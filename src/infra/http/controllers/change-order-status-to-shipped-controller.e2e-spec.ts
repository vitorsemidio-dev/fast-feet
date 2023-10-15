import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryDriverFactory } from 'test/factories/delivery-driver.factory'
import { OrderFactory } from 'test/factories/order.factory'
import { RecipientFactory } from 'test/factories/recipient.factory'
import { TokenFactory } from 'test/factories/token.factory'

const makeRequestBody = (
  override: Partial<{ deliveryDriverId: string }> = {},
): { deliveryDriverId: string } => {
  return {
    deliveryDriverId: new UniqueEntityId().toString(),
    ...override,
  }
}

describe('CreateOrdersController (E2E)', () => {
  // Depedencies
  let app: INestApplication
  let prisma: PrismaService
  let deliveryDriverFactory: DeliveryDriverFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let tokenFactory: TokenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        DeliveryDriverFactory,
        RecipientFactory,
        OrderFactory,
        TokenFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryDriverFactory = moduleRef.get(DeliveryDriverFactory)
    orderFactory = moduleRef.get(OrderFactory)
    tokenFactory = moduleRef.get(TokenFactory)

    await app.init()
  })

  describe('[POST] /orders', () => {
    // Shared variables
    const controller = `/orders/:orderId/ship`
    let recipient: Recipient
    let token: string
    let input: { deliveryDriverId: string }
    let order: Order
    let deliveryDriver: DeliveryDriver

    beforeAll(async () => {
      recipient = await recipientFactory.make()

      deliveryDriver = await deliveryDriverFactory.make()

      order = await orderFactory.make({
        recipientId: recipient.id,
      })

      token = await tokenFactory.make({
        sub: deliveryDriver.id.toString(),
        role: UserRoles.DELIVERY_DRIVER,
      })
    })

    beforeEach(async () => {
      input = makeRequestBody()
    })

    it('should be able to update status to SHIPPED on database', async () => {
      token = await tokenFactory.make({
        role: UserRoles.DELIVERY_DRIVER,
      })
      const body = {
        deliveryDriverId: deliveryDriver.id.toString(),
      }

      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', order.id.toString()))
        .set('Authorization', `Bearer ${token}`)
        .send(body)

      const orderOnDB = await prisma.order.findUnique({
        where: {
          id: order.id.toString(),
        },
      })

      expect(orderOnDB?.status).toBe(OrderStatus.SHIPPED)
      expect(orderOnDB?.shipperId).toBe(body.deliveryDriverId)
    })

    it('should return 403 if user is not DELIVERY_DRIVER', async () => {
      token = await tokenFactory.make({
        role: UserRoles.RECIPIENT,
      })

      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', order.id.toString()))
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })

    it('should not return status code 404 when controller is register', async () => {
      token = await tokenFactory.make({
        role: UserRoles.DELIVERY_DRIVER,
      })

      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', order.id.toString()))
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).not.toBe(404)
    })
  })
})
