import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'
import { DeleteDeliveryDriverUseCase } from './delete-delivery-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new DeleteDeliveryDriverUseCase(deliveryDriversRepository)
  return { sut, deliveryDriversRepository }
}

describe('DeleteDeliveryDriverUseCase', () => {
  let sut: DeleteDeliveryDriverUseCase
  let deliveryDriversRepository: InMemoryDeliveryDriversRepository

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    deliveryDriversRepository = dependencies.deliveryDriversRepository
  })

  it('should delete a delivery driver', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityId('driver_id'),
    )
    await deliveryDriversRepository.create(deliveryDriver)

    const result = await sut.execute({ id: deliveryDriver.id.toString() })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      deliveryDriver,
    })
  })

  it('should is right when delete a delivery driver', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityId('driver_id'),
    )
    await deliveryDriversRepository.create(deliveryDriver)

    const result = await sut.execute({ id: deliveryDriver.id.toString() })

    expect(result.isRight()).toBeTruthy()
  })

  it('should return delivery driver deleted when delete success', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityId('driver_id'),
    )
    await deliveryDriversRepository.create(deliveryDriver)

    const result = await sut.execute({ id: deliveryDriver.id.toString() })

    const value = result.value as { deliveryDriver: DeliveryDriver }
    expect(value?.deliveryDriver).toBeInstanceOf(DeliveryDriver)
  })

  it('should is left if the delivery driver does not exist', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityId('driver_id'),
    )

    const result = await sut.execute({ id: deliveryDriver.id.toString() })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should return a ResourceNotFoundError if the delivery driver does not exist', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {},
      new UniqueEntityId('driver_id'),
    )

    const result = await sut.execute({ id: deliveryDriver.id.toString() })

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
