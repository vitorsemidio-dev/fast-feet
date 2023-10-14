import { makeAddress } from 'test/factories/address.factory'
import { Address, AddressProps } from './address'

const makeSutInput = (overrider: Partial<AddressProps> = {}) => {
  const address = makeAddress()
  const props = {
    ...address.toJson(),
    ...overrider,
  }
  return { props }
}

describe('Address', () => {
  it('should be able to create new address', () => {
    const { props } = makeSutInput()
    const sut = Address.create(props)
    expect(sut).toBeDefined()
  })

  it('should be able to create new address with props provided', () => {
    const { props } = makeSutInput({
      CEP: 'CEP',
      city: 'city',
      complement: 'complement',
      country: 'country',
      neighborhood: 'neighborhood',
      number: 'number',
      state: 'state',
      street: 'street',
    })
    const sut = Address.create(props)
    expect(sut.CEP).toEqual('CEP')
    expect(sut.city).toEqual('city')
    expect(sut.complement).toEqual('complement')
    expect(sut.country).toEqual('country')
    expect(sut.neighborhood).toEqual('neighborhood')
    expect(sut.number).toEqual('number')
    expect(sut.state).toEqual('state')
    expect(sut.street).toEqual('street')
  })
})
