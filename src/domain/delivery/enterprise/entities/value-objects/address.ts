export interface AddressProps {
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  CEP: string
  country: string
}

export class Address {
  private _street: string
  private _number: string
  private _complement?: string | null
  private _neighborhood: string
  private _city: string
  private _state: string
  private _CEP: string
  private _country: string

  private constructor(addressProps: AddressProps) {
    this._street = addressProps.street
    this._number = addressProps.number
    this._complement = addressProps.complement
    this._neighborhood = addressProps.neighborhood
    this._city = addressProps.city
    this._state = addressProps.state
    this._CEP = addressProps.CEP
    this._country = addressProps.country
  }

  static create(addressProps: AddressProps) {
    return new Address(addressProps)
  }

  get value() {
    return this
  }

  get street() {
    return this._street
  }

  get number() {
    return this._number
  }

  get complement() {
    return this._complement
  }

  get neighborhood() {
    return this._neighborhood
  }

  get city() {
    return this._city
  }

  get state() {
    return this._state
  }

  get CEP() {
    return this._CEP
  }

  get country() {
    return this._country
  }

  toJson() {
    return {
      street: this.street,
      number: this.number,
      complement: this.complement,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state,
      CEP: this.CEP,
      country: this.country,
    }
  }
}
