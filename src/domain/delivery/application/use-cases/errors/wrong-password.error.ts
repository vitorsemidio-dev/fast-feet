export class WrongPasswordError extends Error {
  constructor(message = 'Wrong password') {
    super(message)
    this.name = 'WrongPasswordError'
  }
}
