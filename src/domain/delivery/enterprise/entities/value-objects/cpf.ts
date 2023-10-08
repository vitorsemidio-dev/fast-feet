export class InvalidCPFError extends Error {
  constructor(value?: string) {
    const message = value ? `${value} is not a valid CPF` : 'Invalid CPF'
    super(message)
    this.name = InvalidCPFError.name
  }
}

export class CPF {
  private _value: string

  private constructor(value: string) {
    const isValid = CPF.validate(value)
    if (!isValid) {
      throw new InvalidCPFError(`${value}`)
    }
    this._value = CPF.unformat(value)
  }

  get value() {
    return this._value
  }

  static format(value: string): string {
    const isValid = CPF.validate(value)
    if (!isValid) {
      throw new InvalidCPFError(`${value}`)
    }
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static unformat(value: string): string {
    const isValid = CPF.validate(value)
    if (!isValid) {
      throw new InvalidCPFError(`${value}`)
    }
    return value.replace(/\D/g, '')
  }

  static create(value: string): CPF {
    return new CPF(value)
  }

  /**
   * Valida um número de CPF brasileiro.
   *
   * Esta função segue o algoritmo de validação oficial da Receita Federal do Brasil.
   * Para mais informações sobre a validação de CPF, consulte:
   * @see https://dicasdeprogramacao.com.br/algoritmo-para-validar-cpf/
   *
   * @param {string} cpf - O número de CPF a ser validado.
   * @returns {boolean} True se o CPF é válido, caso contrário, False.
   */
  static validate(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '')

    if (cpf.length !== 11) {
      return false
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    const firstDigit = (sum * 10) % 11

    if (firstDigit !== parseInt(cpf.charAt(9))) {
      return false
    }

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    const secondDigit = (sum * 10) % 11

    return secondDigit === parseInt(cpf.charAt(10))
  }
}