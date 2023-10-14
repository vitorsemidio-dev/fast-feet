export class InvalidDeliveryUpdateError extends Error {
  constructor(message: string = 'Invalid delivery update') {
    super(message)
    this.name = 'InvalidDeliveryUpdateError'
  }
}
