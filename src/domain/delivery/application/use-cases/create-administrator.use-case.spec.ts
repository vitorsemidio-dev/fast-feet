import {
  CreateAdministratorUseCase,
  CreateAdministratorUseCaseInput,
} from '@/domain/delivery/application/use-cases/create-administrator.use-case'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { FakeHasher } from 'test/cryptography/faker-hash'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators.repository'

const makeSut = () => {
  const administratorRepository = new InMemoryAdministratorsRepository()
  const hashGenerator = new FakeHasher()
  const sut = new CreateAdministratorUseCase(
    administratorRepository,
    hashGenerator,
  )
  return {
    sut,
    administratorRepository,
    hashGenerator,
  }
}

const makeSutInput = (
  override: Partial<CreateAdministratorUseCaseInput> = {},
): CreateAdministratorUseCaseInput => {
  return {
    cpf: '12345678910',
    name: 'Administrator',
    password: '123456',
    ...override,
  }
}

describe('CreateAdministratorUseCase', () => {
  let sut: CreateAdministratorUseCase
  let administratorRepository: InMemoryAdministratorsRepository
  let hashGenerator: FakeHasher

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    administratorRepository = dependencies.administratorRepository
    hashGenerator = dependencies.hashGenerator
  })

  it('should be able to create new administrator', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)

    expect(output?.isRight()).toEqual(true)
  })

  it('should be able to persist new administrator', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)

    expect(administratorRepository.itens).toHaveLength(1)
    expect(administratorRepository.itens[0].id.toString()).toEqual(
      output.value?.administrator.id.toString(),
    )
    expect(administratorRepository.itens[0].name).toEqual(input.name)
    expect(administratorRepository.itens[0].cpf).toEqual(input.cpf)
  })

  it('should be able to return administrator when create new administrator', async () => {
    const input = makeSutInput()

    const output = await sut.execute(input)

    expect(output.value?.administrator).toEqual(
      expect.objectContaining({
        id: expect.any(Object),
        cpf: input.cpf,
        name: input.name,
        password: expect.any(String),
        role: Roles.ADMINISTRATOR,
      }),
    )
  })

  it('should be able to hash password when create new administrator', async () => {
    const input = makeSutInput()

    await sut.execute(input)

    expect(administratorRepository.itens[0].password).toBeDefined()
    expect(administratorRepository.itens[0].password).not.toEqual(
      input.password,
    )
    expect(administratorRepository.itens[0].password).toEqual(
      await hashGenerator.hash(input.password),
    )
  })
})
