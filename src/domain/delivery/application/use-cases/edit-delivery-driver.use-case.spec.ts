import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { fakerPtBr } from 'test/utils/faker'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import {
  EditDeliveryDriverUseCase,
  EditDeliveryDriverUseCaseInput,
} from './edit-delivery-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new EditDeliveryDriverUseCase(deliveryDriversRepository)
  return { sut, deliveryDriversRepository }
}

const makeSutInput = (
  overrider: Partial<EditDeliveryDriverUseCaseInput> = {},
) => {
  return {
    deliveryDriverId: new UniqueEntityId().toString(),
    name: fakerPtBr.name.fullName(),
    ...overrider,
  }
}

describe('EditDeliveryDriverUseCase', () => {
  let sut: EditDeliveryDriverUseCase
  let deliveryDriversRepository: InMemoryDeliveryDriversRepository

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    deliveryDriversRepository = dependencies.deliveryDriversRepository
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should be able to update delivery driver', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {
        name: 'old-name',
      },
      new UniqueEntityId('existing-id'),
    )
    await deliveryDriversRepository.create(deliveryDriver)

    const input = makeSutInput({
      deliveryDriverId: 'existing-id',
      name: 'new-name',
    })

    await sut.execute(input)

    const deliveryDriverOnDB = deliveryDriversRepository.itens[0].toJson()
    expect(deliveryDriverOnDB).toEqual(
      expect.objectContaining({
        id: 'existing-id',
        name: 'new-name',
      }),
    )
  })

  it('should return delivery driver updated', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {
        name: 'old-name',
      },
      new UniqueEntityId('existing-id'),
    )
    await deliveryDriversRepository.create(deliveryDriver)

    const input = makeSutInput({
      deliveryDriverId: 'existing-id',
      name: 'new-name',
    })

    const output = await sut.execute(input)
    const value = output.value as { deliveryDriver: DeliveryDriver }

    expect(value.deliveryDriver.toJson()).toEqual(
      expect.objectContaining({
        id: 'existing-id',
        name: 'new-name',
      }),
    )
  })

  it('should return ResourceNotFoundError if delivery driver does not exists', async () => {
    const input = makeSutInput({ deliveryDriverId: 'non-existing-id' })

    const output = await sut.execute(input)

    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should is left if delivery driver does not exists', async () => {
    const input = makeSutInput({ deliveryDriverId: 'non-existing-id' })

    const output = await sut.execute(input)

    expect(output.isLeft()).toBeTruthy()
  })
})
