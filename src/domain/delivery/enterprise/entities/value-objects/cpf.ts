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

  static create(value: string): CPF {
    return new CPF(value)
  }

  get value() {
    return this._value
  }

  static format(value: string): string {
    const isValid = CPF.validate(value)
    if (!isValid) {
      throw new InvalidCPFError(`${value}`)
    }

    const _value = CPF.normalizeCPF(value)
    return _value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static unformat(value: string): string {
    const isValid = CPF.validate(value)
    if (!isValid) {
      throw new InvalidCPFError(`${value}`)
    }
    const _value = CPF.normalizeCPF(value)
    return _value.replace(/\D/g, '')
  }

  static normalizeCPF(value: string | number): string {
    const cpf = value.toString().replace(/\D/g, '')
    return cpf.padStart(11, '0')
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
    const _value = CPF.normalizeCPF(cpf)
    cpf = _value.replace(/\D/g, '')

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

  private static getCPFValids(): string[] {
    return [
      '65057795074',
      '99218741012',
      '15566482007',
      '57322330080',
      '19660151004',
      '86562937027',
      '06735254066',
      '24498716086',
      '66827101002',
      '29338210014',
      '93403255085',
      '92112383078',
      '52616915081',
      '28311624089',
      '74151619046',
      '42093464039',
      '16471304099',
      '01906596026',
    ]
  }

  static makeRandom(_index?: number): CPF {
    const cpfs = CPF.getCPFValids()
    const index = SafeCPFIndexGenerator.safeIndex
    return CPF.create(cpfs[_index ?? index])
  }
}

export class SafeCPFIndexGenerator {
  static currentIndex = 0
  static maxIndex = 15

  static get safeIndex() {
    const currentIndex = SafeCPFIndexGenerator.currentIndex
    SafeCPFIndexGenerator.currentIndex++
    return currentIndex % SafeCPFIndexGenerator.maxIndex
  }
}
