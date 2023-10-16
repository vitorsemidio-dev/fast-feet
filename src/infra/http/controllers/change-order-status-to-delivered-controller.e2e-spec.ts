import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { ChangeOrderStatusToDeliveriedBody } from '@/infra/http/controllers/change-order-status-to-delivered.controller'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryDriverFactory } from 'test/factories/delivery-driver.factory'
import { OrderFactory } from 'test/factories/order.factory'
import { RecipientFactory } from 'test/factories/recipient.factory'
import { TokenFactory } from 'test/factories/token.factory'
import { fakerPtBr } from 'test/utils/faker'

const makeRequestBody = (
  override: Partial<ChangeOrderStatusToDeliveriedBody> = {},
): ChangeOrderStatusToDeliveriedBody => {
  return {
    photoURL: fakerPtBr.internet.url(),
    ...override,
  }
}

describe('ChangeOrderStatusToDeliveredController (E2E)', () => {
  // Depedencies
  let app: INestApplication
  let prisma: PrismaService
  let deliveryDriverFactory: DeliveryDriverFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let tokenFactory: TokenFactory
  const controller = `/orders/:orderId/delivery`

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

  describe(`[PATCH] ${controller}`, () => {
    // Shared variables
    let recipient: Recipient
    let token: string
    let order: Order
    let deliveryDriver: DeliveryDriver

    beforeAll(async () => {
      recipient = await recipientFactory.make()

      deliveryDriver = await deliveryDriverFactory.make()

      order = await orderFactory.make({
        recipientId: recipient.id,
        status: OrderStatus.SHIPPED,
        shippedBy: deliveryDriver.id,
      })

      token = await tokenFactory.make({
        sub: deliveryDriver.id.toString(),
        role: deliveryDriver.role,
      })
    })

    it('should be able to update status to DELIVERED on database', async () => {
      const input = makeRequestBody()

      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', order.id.toString()))
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      const orderOnDB = await prisma.order.findUnique({
        where: {
          id: order.id.toString(),
        },
      })

      expect(orderOnDB?.status).toBe(OrderStatus.DELIVERED)
      expect(orderOnDB?.photoUrl).toBeTruthy()
      expect(orderOnDB?.photoUrl).toEqual(input.photoURL)
      expect(orderOnDB?.deliveredAt).toBeTruthy()
      expect(orderOnDB?.deliveryDriverId).toBe(deliveryDriver.id.toString())
    })

    it('should return 403 if delivery driver is not shipper', async () => {
      const input = makeRequestBody()
      const wrongDeliveryDriver = await deliveryDriverFactory.make()
      const _order = await orderFactory.make({
        recipientId: recipient.id,
        status: OrderStatus.SHIPPED,
        shippedBy: deliveryDriver.id,
      })

      token = await tokenFactory.make({
        sub: wrongDeliveryDriver.id.toString(),
        role: wrongDeliveryDriver.role,
      })

      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', _order.id.toString()))
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })

    it('should return 403 if user is not DELIVERY_DRIVER', async () => {
      token = await tokenFactory.make({
        role: UserRoles.RECIPIENT,
      })

      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', order.id.toString()))
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(403)
    })

    it('should not return status code 404 when controller is register', async () => {
      const response = await request(app.getHttpServer())
        .patch(`${controller}`.replace(':orderId', order.id.toString()))
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).not.toBe(404)
    })
  })
})
