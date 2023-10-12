import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { EditDeliveryDriverUseCase } from './edit-delivery-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new EditDeliveryDriverUseCase(deliveryDriversRepository)
  return { sut }
}

describe('EditDeliveryDriverUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should return ResourceNotFoundError if delivery driver does not exists', async () => {
    const { sut } = makeSut()

    const output = await sut.execute({
      deliveryDriverId: 'non-existing-id',
    })

    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should is left if delivery driver does not exists', async () => {
    const { sut } = makeSut()

    const output = await sut.execute({
      deliveryDriverId: 'non-existing-id',
    })

    expect(output.isLeft()).toBeTruthy()
  })
})
