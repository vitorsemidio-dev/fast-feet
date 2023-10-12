import { ChangePasswordFromDeliveryDriverUseCase } from './change-password-from-delivery-driver.use-case'

const makeSut = () => {
  const sut = new ChangePasswordFromDeliveryDriverUseCase()
  return {
    sut,
  }
}

describe('ChangePasswordFromDeliveryDriverUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
