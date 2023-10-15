import {
  CPF,
  InvalidCPFError,
} from '@/domain/delivery/enterprise/entities/value-objects/cpf'

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
    const valids = resultValids.filter((valid, i) => {
      if (!valid) console.log(`CPF ${cpfs[i]} is invalid`)
      return valid
    })
    expect(valids.length).toEqual(resultValids.length)
  })

  it('should be able call makeRandom method providing an index', () => {
    const cpf0 = CPF.makeRandom(0)
    const cpf1 = CPF.makeRandom(1)

    expect(cpf0.value).toEqual(CPF['getCPFValids']()[0])
    expect(cpf1.value).toEqual(CPF['getCPFValids']()[1])
  })

  it('should be able to call makeRandom method and return randomCPF', () => {
    const cpf = CPF.makeRandom()

    expect(cpf.value).toEqual(expect.any(String))
  })
})
