import { CreateAdministratorUseCase } from './create-administrator.use-case'

const makeSut = () => {
  const sut = new CreateAdministratorUseCase()
  return {
    sut,
  }
}

describe('CreateAdministratorUseCase', () => {
  let sut: CreateAdministratorUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    sut = dependencies.sut
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
})
