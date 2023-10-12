import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'
import { ChangePasswordFromDeliveryDriverUseCase } from './change-password-from-delivery-driver.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

const makeSut = () => {
  const deliveryDriversRepository = new InMemoryDeliveryDriversRepository()
  const sut = new ChangePasswordFromDeliveryDriverUseCase(
    deliveryDriversRepository,
  )
  return {
    sut,
    deliveryDriversRepository,
  }
}

const makeSutInput = () => {
  return {
    deliveryDriverId: new UniqueEntityId().toString(),
  }
}

describe('ChangePasswordFromDeliveryDriverUseCase', () => {
  let sut: ChangePasswordFromDeliveryDriverUseCase
  let deliveryDriversRepository: InMemoryDeliveryDriversRepository

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    deliveryDriversRepository = dependencies.deliveryDriversRepository
  })

  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('should return ResourceNotFoundError if delivery driver does not exists', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)

    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
    expect(output.isLeft()).toBeTruthy()
  })
})
