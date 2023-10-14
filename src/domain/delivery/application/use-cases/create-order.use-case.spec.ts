import { CreateOrderUseCase } from './create-order.use-case'

const makeSut = () => {
  const sut = new CreateOrderUseCase()
  return {
    sut,
  }
}

describe('CreateOrderUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
