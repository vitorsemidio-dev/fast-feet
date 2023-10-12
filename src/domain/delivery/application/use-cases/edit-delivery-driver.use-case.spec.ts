import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { EditDeliveryDriverUseCase } from './edit-delivery-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new EditDeliveryDriverUseCase(deliveryDriversRepository)
  return { sut, deliveryDriversRepository }
}

describe('EditDeliveryDriverUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should be able to update delivery driver', async () => {
    const { sut, deliveryDriversRepository } = makeSut()
    const deliveryDriver = makeDeliveryDriver(
      {
        name: 'old-name',
      },
      new UniqueEntityId('existing-id'),
    )
    await deliveryDriversRepository.create(deliveryDriver)

    await sut.execute({
      deliveryDriverId: 'existing-id',
      name: 'new-name',
    })

    const deliveryDriverOnDB = deliveryDriversRepository.itens[0].toJson()

    expect(deliveryDriverOnDB).toEqual(
      expect.objectContaining({
        id: 'existing-id',
        name: 'new-name',
      }),
    )
  })

  it('should return ResourceNotFoundError if delivery driver does not exists', async () => {
    const { sut } = makeSut()

    const output = await sut.execute({
      deliveryDriverId: 'non-existing-id',
      name: 'any-name',
    })

    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should is left if delivery driver does not exists', async () => {
    const { sut } = makeSut()

    const output = await sut.execute({
      deliveryDriverId: 'non-existing-id',
      name: 'any-name',
    })

    expect(output.isLeft()).toBeTruthy()
  })
})
