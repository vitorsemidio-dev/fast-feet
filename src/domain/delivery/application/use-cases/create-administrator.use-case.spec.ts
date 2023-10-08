import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators.repository'
import { CreateAdministratorUseCase } from './create-administrator.use-case'

const makeSut = () => {
  const administratorRepository = new InMemoryAdministratorsRepository()
  const sut = new CreateAdministratorUseCase(administratorRepository)
  return {
    sut,
    administratorRepository,
  }
}

describe('CreateAdministratorUseCase', () => {
  let sut: CreateAdministratorUseCase
  let administratorRepository: InMemoryAdministratorsRepository

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    administratorRepository = dependencies.administratorRepository
  })

  it('should be able to create new administrator', async () => {
    const input = {
      name: 'Administrator',
      cpf: '12345678910',
      password: '123456',
    }

    const output = await sut.execute(input)

    expect(output?.isRight()).toEqual(true)
  })

  it('should be able to persist new administrator', async () => {
    const input = {
      name: 'Administrator',
      cpf: '12345678910',
      password: '123456',
    }

    const output = await sut.execute(input)

    expect(administratorRepository.itens).toHaveLength(1)
    expect(administratorRepository.itens[0].id.toString()).toEqual(
      output.value?.administrator.id.toString(),
    )
    expect(administratorRepository.itens[0].name).toEqual(input.name)
    expect(administratorRepository.itens[0].cpf).toEqual(input.cpf)
  })
})
