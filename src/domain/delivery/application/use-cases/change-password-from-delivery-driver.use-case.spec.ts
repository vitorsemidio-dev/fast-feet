import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FakeHasher } from 'test/cryptography/faker-hash'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { fakerPtBr } from 'test/utils/faker'
import { HashGenerator } from '../cryptography/hash-generator'
import {
  ChangePasswordFromDeliveryDriverUseCase,
  ChangePasswordFromDeliveryDriverUseCaseInput,
} from './change-password-from-delivery-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { WrongPasswordError } from './errors/wrong-password.error'

const makeSut = () => {
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new ChangePasswordFromDeliveryDriverUseCase(
    deliveryDriversRepository,
  )
  return {
    sut,
    deliveryDriversRepository,
  }
}

const makeSutInput = (
  overrider: Partial<ChangePasswordFromDeliveryDriverUseCaseInput> = {},
) => {
  return {
    deliveryDriverId: new UniqueEntityId().toString(),
    oldPassword: fakerPtBr.internet.password(),
    ...overrider,
  }
}

describe('ChangePasswordFromDeliveryDriverUseCase', () => {
  let sut: ChangePasswordFromDeliveryDriverUseCase
  let deliveryDriversRepository: InMemoryDeliveryDriversRepository
  let hashGenerator: HashGenerator

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    deliveryDriversRepository = dependencies.deliveryDriversRepository
    hashGenerator = new FakeHasher()
  })

  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should return ResourceNotFoundError if delivery driver does not exists', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)

    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
    expect(output.isLeft()).toBeTruthy()
  })

  it('should return WrongPasswordError if provide wrong old password', async () => {
    const deliveryDriver = makeDeliveryDriver({
      password: 'old-password',
    })
    await deliveryDriversRepository.create(
      makeDeliveryDriver(
        {
          cpf: deliveryDriver.cpf,
          name: deliveryDriver.name,
          role: deliveryDriver.role,
          password: await hashGenerator.hash(deliveryDriver.password),
        },
        deliveryDriver.id,
      ),
    )
    const input = makeSutInput({
      deliveryDriverId: deliveryDriver.id.toString(),
      oldPassword: 'wrong-old-password',
    })

    const output = await sut.execute(input)

    expect(output.value).toBeInstanceOf(WrongPasswordError)
    expect(output.isLeft()).toBeTruthy()
  })
})
