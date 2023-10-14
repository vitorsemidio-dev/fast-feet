import { ChangeOrderStatusToShippedUseCase } from './change-order-status-to-shipped.use-case'

const makeSut = () => {
  const sut = new ChangeOrderStatusToShippedUseCase()
  return {
    sut,
  }
}

describe('ChangeOrderStatusToShippedUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
