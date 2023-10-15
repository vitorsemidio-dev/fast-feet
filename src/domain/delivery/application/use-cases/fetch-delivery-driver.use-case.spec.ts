import { FetchDeliveryDriverUseCase } from '@/domain/delivery/application/use-cases/fetch-delivery-driver.use-case'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'

const makeSut = () => {
  const deliveryDriverRepository = new InMemoryDeliveryDriversRepository()
  const sut = new FetchDeliveryDriverUseCase(deliveryDriverRepository)
  return {
    sut,
    deliveryDriverRepository,
  }
}

describe('FetchDeliveryDriverUseCase', () => {
  it('should be able to fetch delivery drivers', async () => {
    const { sut } = makeSut()

    const output = await sut.execute()

    expect(output.isRight()).toEqual(true)
  })

  it('should be able to fetch 3 delivery drivers', async () => {
    const { sut, deliveryDriverRepository } = makeSut()
    for (let i = 0; i < 3; i++) {
      await deliveryDriverRepository.create(makeDeliveryDriver())
    }

    const output = await sut.execute()

    expect(output.value?.deliveryDrivers).toHaveLength(3)
  })
})
