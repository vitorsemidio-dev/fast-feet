import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdministrator } from 'test/factories/administrator.factory'

describe('CreateDeliveryDriversController (E2E)', () => {
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

  describe('[POST] /delivery-drivers', () => {
    let input

    beforeEach(async () => {
      administrator = makeAdministrator()
      token = await jwtEncrypter.encrypt({
        sub: administrator.id.toString(),
        role: UserRoles.ADMINISTRATOR,
      })
      input = {
        name: 'Delivery Driver',
        password: '123456',
        cpf: CPF.makeRandom().value,
      }
    })

    it('should return status code 201 when create', async () => {
      const response = await request(app.getHttpServer())
        .post('/delivery-drivers')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(201)
    })

    it('should persiste data on database', async () => {
      const response = await request(app.getHttpServer())
        .post('/delivery-drivers')
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
        .post('/delivery-drivers')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      const response = await request(app.getHttpServer())
        .post('/delivery-drivers')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(409)
    })

    it('should return status code 401 when user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/delivery-drivers')
        .send(input)

      expect(response.statusCode).toBe(401)
    })

    it('should return status code 403 when authenticate user is RECIPIENT', async () => {
      token = await jwtEncrypter.encrypt({
        sub: administrator.id.toString(),
        role: UserRoles.RECIPIENT,
      })

      const response = await request(app.getHttpServer())
        .post('/delivery-drivers')
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
        .post('/delivery-drivers')
        .set('Authorization', `Bearer ${token}`)
        .send(input)

      expect(response.statusCode).toBe(403)
    })
  })
})
