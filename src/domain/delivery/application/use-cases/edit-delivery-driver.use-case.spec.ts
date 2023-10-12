import { EditDeliveryDriverUseCase } from './edit-delivery-driver.use-case'

describe('EditDeliveryDriverUseCase', () => {
  it('should be defined', () => {
    const sut = new EditDeliveryDriverUseCase()
    expect(sut).toBeDefined()
  })
})
