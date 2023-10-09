import {
  AuthenticateUseCase,
  AuthenticateUseCaseInput,
} from '@/domain/delivery/application/use-cases/authenticate.use-case'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/faker-hash'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators.repository'
import { Administrator } from '../../enterprise/entities/administrator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

const makeSut = () => {
  const administratorRepository = new InMemoryAdministratorsRepository()
  const hashGenerator = new FakeHasher()
  const encrypter = new FakeEncrypter()
  const sut = new AuthenticateUseCase(
    administratorRepository,
    encrypter,
    hashGenerator,
  )
  return {
    sut,
    administratorRepository,
    encrypter,
    hashGenerator,
  }
}

const makeSutInput = (
  override: Partial<AuthenticateUseCaseInput> = {},
): AuthenticateUseCaseInput => {
  return {
    cpf: '52998224725',
    password: '123456',
    ...override,
  }
}

describe('AuthenticateUseCase', () => {
  let sut: AuthenticateUseCase
  let administratorRepository: InMemoryAdministratorsRepository
  let hashGenerator: FakeHasher
  let encrypter: FakeEncrypter

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
    administratorRepository = dependencies.administratorRepository
    hashGenerator = dependencies.hashGenerator
    encrypter = dependencies.encrypter
  })

  it('should be able to generate token when authenticate', async () => {
    const input = makeSutInput()
    await administratorRepository.create(
      Administrator.create({
        cpf: CPF.create(input.cpf),
        name: 'Administrator',
        password: await hashGenerator.hash(input.password),
      }),
    )

    const output = await sut.execute(input)

    expect(output?.isRight()).toEqual(true)
    expect(output?.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })

  it('should be able to return undefined when authenticate with invalid credentials', async () => {
    const input = makeSutInput({ password: 'invalid_password' })

    const output = await sut.execute(input)

    expect(output?.isLeft()).toEqual(true)
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should be able to return undefined when authenticate with invalid cpf', async () => {
    const input = makeSutInput({ cpf: 'invalid_cpf' })

    const output = await sut.execute(input)

    expect(output?.isLeft()).toEqual(true)
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })
})
