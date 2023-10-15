import {
  AuthenticateUseCase,
  AuthenticateUseCaseInput,
} from '@/domain/delivery/application/use-cases/authenticate.use-case'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error'
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/faker-hash'
import { makeAdministrator } from 'test/factories/administrator.factory'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators.repository'

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

  let administrator: Administrator
  beforeEach(async () => {
    administrator = makeAdministrator()
    const passwordHash = await hashGenerator.hash(administrator.password)
    const _administrator = makeAdministrator({
      ...administrator.toJson(),
      password: passwordHash,
    })
    await administratorRepository.create(_administrator)
  })

  it('should be able to generate token when authenticate', async () => {
    const input = makeSutInput({
      cpf: administrator.cpf.value,
      password: administrator.password,
    })

    const output = await sut.execute(input)

    expect(output?.isRight()).toEqual(true)
    expect(output?.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })

  it('should be able to throw WrongCredentialsError when provide wrong password', async () => {
    const input = makeSutInput({
      cpf: administrator.cpf.value,
      password: 'worng_password',
    })

    const output = await sut.execute(input)

    expect(output?.isLeft()).toEqual(true)
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should be able to throw WrongCredentialsError when provide wrong cpf', async () => {
    const input = makeSutInput({
      cpf: 'wront_cpf',
      password: administrator.password,
    })

    const output = await sut.execute(input)

    expect(output?.isLeft()).toEqual(true)
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should be able to throw WrongCredentialsError when provide cpf that does not exist', async () => {
    const input = makeSutInput({ cpf: 'any_cpf', password: 'any_password' })

    const output = await sut.execute(input)

    expect(output?.isLeft()).toEqual(true)
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })
})
