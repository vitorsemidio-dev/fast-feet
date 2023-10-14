import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient.repository'
import { CreateOrderUseCase } from './create-order.use-case'

const makeSut = () => {
  const recipientsRepository = new InMemoryRecipientsRepository()
  const sut = new CreateOrderUseCase(recipientsRepository)
  return {
    sut,
  }
}

describe('CreateOrderUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should not be able to create if not found recipient', async () => {
    const { sut } = makeSut()
    const recipientId = 'recipient-not-exist'
    const result = await sut.execute({ recipientId })
    expect(result.isLeft()).toBeTruthy()
  })
})
