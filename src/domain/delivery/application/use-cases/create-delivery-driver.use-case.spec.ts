import { FakeHasher } from 'test/cryptography/faker-hash'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import {
  CreateDeliveryDriverUseCase,
  CreateDeliveryDriverUseCaseInput,
} from './create-delivery-driver.use-case'
import { CPFAlreadyExistsError } from './errors/cpf-already-exists.error'

const makeSut = () => {
  const deliveryDriverRepository = new InMemoryDeliveryDriversRepository()
  const hashGenerator = new FakeHasher()
  const sut = new CreateDeliveryDriverUseCase(
    deliveryDriverRepository,
    hashGenerator,
  )
  return {
    sut,
    deliveryDriverRepository,
    hashGenerator,
  }
}

const makeSutInput = (
  override: Partial<CreateDeliveryDriverUseCaseInput> = {},
): CreateDeliveryDriverUseCaseInput => {
  return {
    cpf: '52998224725',
    name: 'Delivery Driver',
    password: '123456',
    ...override,
  }
}

describe('CreateDeliveryDriverUseCase', () => {
  let sut: CreateDeliveryDriverUseCase
  let deliveryDriverRepository: InMemoryDeliveryDriversRepository
  let hashGenerator: FakeHasher

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    deliveryDriverRepository = dependencies.deliveryDriverRepository
    hashGenerator = dependencies.hashGenerator
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should be able to create new delivery driver', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)

    expect(output.isRight()).toEqual(true)
  })

  it('should be able to persist new delivery driver', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)
    const value = output.getRight()

    expect(deliveryDriverRepository.itens.length).toEqual(1)
    expect(deliveryDriverRepository.itens[0].id.toString()).toEqual(
      value.deliveryDriver.id.toString(),
    )
  })

  it('should be able to return delivery driver when create new delivery driver', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)
    const value = output.getRight()

    expect(value.deliveryDriver).toBeInstanceOf(DeliveryDriver)
  })

  it('should be able to hash password when create new delivery driver', async () => {
    const input = makeSutInput()

    await sut.execute(input)

    expect(deliveryDriverRepository.itens[0].password).toBeDefined()
    expect(deliveryDriverRepository.itens[0].password).not.toEqual(
      input.password,
    )
    expect(deliveryDriverRepository.itens[0].password).toEqual(
      await hashGenerator.hash(input.password),
    )
  })

  it('should not be able to create new delivery driver with same cpf', async () => {
    const input = makeSutInput()
    await sut.execute(input)

    const output = await sut.execute(input)

    expect(output?.isLeft()).toEqual(true)
    expect(output?.value).instanceOf(CPFAlreadyExistsError)
  })
})
