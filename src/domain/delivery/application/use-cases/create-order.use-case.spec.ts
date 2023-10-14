import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAddress } from 'test/factories/address.factory'
import { makeRecipient } from 'test/factories/recipient.factory'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient.repository'
import { fakerPtBr } from 'test/utils/faker'
import { Order } from '../../enterprise/entities/order'
import {
  CreateOrderUseCase,
  CreateOrderUseCaseInput,
} from './create-order.use-case'

const makeSut = () => {
  const recipientsRepository = new InMemoryRecipientsRepository()
  const ordersRepository = new InMemoryOrdersRepository()
  const sut = new CreateOrderUseCase(recipientsRepository, ordersRepository)
  return {
    sut,
    recipientsRepository,
    ordersRepository,
  }
}

const makeSutInput = (
  override: Partial<CreateOrderUseCaseInput> = {},
): CreateOrderUseCaseInput => {
  const address = makeAddress()
  return {
    name: fakerPtBr.commerce.product(),
    recipientId: new UniqueEntityId().toString(),
    CEP: address.city,
    city: address.city,
    complement: address.complement,
    country: address.country,
    neighborhood: address.neighborhood,
    number: address.number,
    state: address.state,
    street: address.street,
    ...override,
  }
}

describe('CreateOrderUseCase', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should not be able to create if not found recipient', async () => {
    const { sut } = makeSut()
    const input = makeSutInput({
      recipientId: 'recipient-not-exist',
    })
    const result = await sut.execute(input)
    expect(result.isLeft()).toBeTruthy()
  })

  it('should be able to return instance of Order when create', async () => {
    const { sut, recipientsRepository } = makeSut()
    const recipient = makeRecipient()
    const input = makeSutInput({
      recipientId: recipient.id.toString(),
    })
    recipientsRepository.itens.push(recipient)

    const output = await sut.execute(input)
    const value = output.getRight()

    expect(output.isRight()).toBeTruthy()
    expect(value.order).toBeInstanceOf(Order)
  })

  it('should be able to persiste order on database', async () => {
    const { sut, recipientsRepository, ordersRepository } = makeSut()
    const recipient = makeRecipient()
    const input = makeSutInput({
      recipientId: recipient.id.toString(),
    })
    recipientsRepository.itens.push(recipient)

    const output = await sut.execute(input)
    const value = output.getRight()

    const orderOnDB = ordersRepository.itens[0]

    expect(ordersRepository.itens).toHaveLength(1)
    expect(orderOnDB.id.toString()).toBe(value.order.id.toString())
    expect(orderOnDB.recipientId.toString()).toBe(input.recipientId)
    expect(orderOnDB.name).toBe(input.name)
  })
})
