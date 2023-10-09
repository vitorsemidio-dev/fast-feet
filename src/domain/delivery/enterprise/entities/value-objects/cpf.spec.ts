import { CPF, InvalidCPFError } from './cpf'

describe('CPF', () => {
  it('should be able to create new CPF providing value with mask', () => {
    const sut = CPF.create('529.982.247-25')

    expect(sut.value).toEqual('52998224725')
  })

  it('should be able to create new CPF providing value without mask', () => {
    const sut = CPF.create('52998224725')

    expect(sut.value).toEqual('52998224725')
  })

  it('should be able to create new CPF providing value as number', () => {
    const sut = CPF.create(52998224725 as any)

    expect(sut.value).toEqual('52998224725')
  })

  it('should save a CPF value without formatting', () => {
    const sut = CPF.create('529.982.247-25')

    expect(sut.value).toEqual('52998224725')
  })

  it('should be able to create a new CPF with valid value starting with 0', () => {
    const sut = CPF.create('07837558057')

    expect(sut.value).toEqual('07837558057')
  })

  it('should be able to create new CPF providing value as number with less then 11 digits', () => {
    const sut = CPF.create(7837558057 as any)

    expect(sut.value).toEqual('07837558057')
  })

  it('should not be able to create new CPF with invalid value', () => {
    expect(() => CPF.create('12345678910')).toThrow(InvalidCPFError)
  })

  it('should not be able to format a CPF with invalid value', () => {
    expect(() => CPF.format('12345678910')).toThrow(InvalidCPFError)
  })

  it('should not be able to unformat a CPF with invalid value', () => {
    expect(() => CPF.unformat('123.456.789-10')).toThrow(InvalidCPFError)
  })

  it('should validate all cpf from CPF.getCPFValids() method', () => {
    const cpfs = CPF['getCPFValids']()
    const resultValids = cpfs.map((cpf) => {
      return CPF.validate(cpf)
    })
    const valids = resultValids.filter((valid) => valid === true)
    expect(valids.length).toEqual(resultValids.length)
  })
})
