import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found.error'
import { GetDeliveryDrivierByCPFUseCase } from '@/domain/delivery/application/use-cases/get-delivery-driver-by-cpf.use-case'
import { DeliveryDriver } from '@/domain/delivery/enterprise/entities/delivery-driver'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { makeDeliveryDriver } from 'test/factories/delivery-driver.factory'
import { InMemoryDeliveryDriversRepository } from 'test/repositories/in-memory-delivery-drivers.repository'

const makeSut = () => {
  const deliveryDriverRepository = new InMemoryDeliveryDriversRepository()
  const sut = new GetDeliveryDrivierByCPFUseCase(deliveryDriverRepository)
  return {
    sut,
    deliveryDriverRepository,
  }
}

describe('GetDeliveryDrivierByCPFUseCase', () => {
  it('should is right when found delivery driver with cpf provided', async () => {
    const { sut, deliveryDriverRepository } = makeSut()
    const deliveryDriverDB = makeDeliveryDriver()
    await deliveryDriverRepository.create(deliveryDriverDB)

    const output = await sut.execute({
      cpf: deliveryDriverDB.cpf.value,
    })

    expect(output.isRight()).toEqual(true)
  })

  it('should be able to return delivery driver with correct data', async () => {
    const { sut, deliveryDriverRepository } = makeSut()

    const deliveryDriverDB0 = makeDeliveryDriver({
      cpf: CPF.makeRandom(0),
    })
    const deliveryDriverDB1 = makeDeliveryDriver({
      cpf: CPF.makeRandom(1),
    })
    const deliveryDriverDB2 = makeDeliveryDriver({
      cpf: CPF.makeRandom(2),
    })

    await deliveryDriverRepository.create(deliveryDriverDB0)
    await deliveryDriverRepository.create(deliveryDriverDB1)
    await deliveryDriverRepository.create(deliveryDriverDB2)

    const output0 = await sut.execute({
      cpf: deliveryDriverDB0.cpf.value,
    })
    const output1 = await sut.execute({
      cpf: deliveryDriverDB1.cpf.value,
    })
    const output2 = await sut.execute({
      cpf: deliveryDriverDB2.cpf.value,
    })

    const value0 = output0.getRight()
    const value1 = output1.getRight()
    const value2 = output2.getRight()

    expect(value0.deliveryDriver).toEqual(deliveryDriverDB0)
    expect(value1.deliveryDriver).toEqual(deliveryDriverDB1)
    expect(value2.deliveryDriver).toEqual(deliveryDriverDB2)
  })

  it('should be able to return delivery driver instance', async () => {
    const { sut, deliveryDriverRepository } = makeSut()
    const deliveryDriverDB = makeDeliveryDriver()
    await deliveryDriverRepository.create(deliveryDriverDB)

    const output = await sut.execute({
      cpf: deliveryDriverDB.cpf.value,
    })
    const value = output.getRight()

    expect(value?.deliveryDriver).toBeInstanceOf(DeliveryDriver)
  })

  it('should is left when not found delivery driver with cpf provided', async () => {
    const { sut } = makeSut()

    const output = await sut.execute({
      cpf: 'any_cpf',
    })

    expect(output.isLeft()).toEqual(true)
  })

  it('should throw ResourceNotFoundError when not found delivery driver with cpf provided', async () => {
    const { sut } = makeSut()

    const output = await sut.execute({
      cpf: 'any_cpf',
    })

    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
