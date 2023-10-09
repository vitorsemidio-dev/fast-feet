export class CPFAlreadyExistsError extends Error {
  constructor(cpf: string) {
    super(`CPF ${cpf} already exists`)
  }
}
