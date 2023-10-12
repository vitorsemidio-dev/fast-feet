import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { EditDeliveryDriverUseCase } from './edit-delivery-driver.use-case'

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
})
