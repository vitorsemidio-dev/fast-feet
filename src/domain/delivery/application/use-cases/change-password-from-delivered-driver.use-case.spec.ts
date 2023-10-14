import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FakeHasher } from 'test/cryptography/faker-hash'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { fakerPtBr } from 'test/utils/faker'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import { HashComparer } from '../cryptography/hash-comparer'
import { HashGenerator } from '../cryptography/hash-generator'
import {
  ChangePasswordFromDeliveredDriverUseCase,
  ChangePasswordFromDeliveredDriverUseCaseInput,
  ChangePasswordFromDeliveredDriverUseCaseOutput,
} from './change-password-from-delivered-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { WrongPasswordError } from './errors/wrong-password.error'

const makeSut = () => {
  const fakeHasher = new FakeHasher()
  const hashComparer = fakeHasher
  const hashGenerator = fakeHasher
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new ChangePasswordFromDeliveredDriverUseCase(
    deliveryDriversRepository,
    hashComparer,
    hashGenerator,
  )
  return {
    sut,
    deliveryDriversRepository,
    hashComparer,
    hashGenerator,
  }
}

const makeSutInput = (
  overrider: Partial<ChangePasswordFromDeliveredDriverUseCaseInput> = {},
) => {
  return {
    deliveryDriverId: new UniqueEntityId().toString(),
    oldPassword: fakerPtBr.internet.password(),
    newPassword: fakerPtBr.internet.password(),
    ...overrider,
  }
}

const getRight = (result: ChangePasswordFromDeliveredDriverUseCaseOutput) => {
  if (result.isLeft()) {
    throw result.value
  }
  return result
}

describe('ChangePasswordFromDeliveredDriverUseCase', () => {
  let sut: ChangePasswordFromDeliveredDriverUseCase
  let deliveryDriversRepository: InMemoryDeliveryDriversRepository
  let hashGenerator: HashGenerator
  let hashComparer: HashComparer

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    deliveryDriversRepository = dependencies.deliveryDriversRepository
    hashComparer = dependencies.hashComparer
    hashGenerator = dependencies.hashGenerator
  })

  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should be able to update delivery driver password and persiste on database new password hashed', async () => {
    const deliveryDriver = makeDeliveryDriver({
      password: 'old-password',
    })
    const deliveryDriverOnDB = deliveryDriver.clone()
    deliveryDriverOnDB.password = await hashGenerator.hash('old-password')
    await deliveryDriversRepository.create(deliveryDriverOnDB)

    const input = makeSutInput({
      deliveryDriverId: deliveryDriver.id.toString(),
      oldPassword: deliveryDriver.password,
      newPassword: 'new-password',
    })

    const output = await sut.execute(input)

    expect(deliveryDriversRepository.itens[0].password).not.toBe(
      await hashGenerator.hash('old-password'),
    )
    expect(deliveryDriversRepository.itens[0].password).toBe(
      await hashGenerator.hash('new-password'),
    )
    expect(output.isRight()).toBeTruthy()
  })

  it('should is right when provide correct old password', async () => {
    const deliveryDriver = makeDeliveryDriver({
      password: 'old-password',
    })
    const deliveryDriverOnDB = deliveryDriver.clone()
    deliveryDriverOnDB.password = await hashGenerator.hash('old-password')
    await deliveryDriversRepository.create(deliveryDriverOnDB)

    const input = makeSutInput({
      deliveryDriverId: deliveryDriver.id.toString(),
      oldPassword: deliveryDriver.password,
    })

    const output = await sut.execute(input)

    expect(output.isRight()).toBeTruthy()
  })

  it('should return delivery instance', async () => {
    const deliveryDriver = makeDeliveryDriver()
    const deliveryDriverOnDB = deliveryDriver.clone()
    deliveryDriverOnDB.password = await hashGenerator.hash(
      deliveryDriver.password,
    )
    await deliveryDriversRepository.create(deliveryDriverOnDB)

    const input = makeSutInput({
      deliveryDriverId: deliveryDriver.id.toString(),
      oldPassword: deliveryDriver.password,
      newPassword: 'any-password',
    })

    const output = await sut.execute(input)
    const { value } = getRight(output)

    expect(value.deliveryDriver).toBeInstanceOf(DeliveryDriver)
    expect(output.isRight()).toBeTruthy()
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
    const deliveryDriverOnDB = deliveryDriver.clone()
    deliveryDriverOnDB.password = await hashGenerator.hash('old-password')
    await deliveryDriversRepository.create(deliveryDriverOnDB)

    const input = makeSutInput({
      deliveryDriverId: deliveryDriver.id.toString(),
      oldPassword: 'wrong-old-password',
    })

    const output = await sut.execute(input)

    expect(output.value).toBeInstanceOf(WrongPasswordError)
    expect(output.isLeft()).toBeTruthy()
  })
})