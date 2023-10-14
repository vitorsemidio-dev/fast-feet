export class InvalidOrderStatusUpdateError extends Error {
  constructor(message: string = 'Invalid order status update') {
    super(message)
    this.name = 'InvalidOrderStatusUpdateError'
  }
}
