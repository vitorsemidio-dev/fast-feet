import { Either, left } from '@/core/either'
import { RecipientsRepository } from '@/core/repositories/recipients.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

export type CreateOrderUseCaseInput = {
  recipientId: string
}

export type CreateOrderUseCaseOutput = Either<ResourceNotFoundError, void>

export class CreateOrderUseCase {
  constructor(private readonly recipientsRepository: RecipientsRepository) {}
  async execute({
    recipientId,
  }: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput> {
    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) {
      return left(new ResourceNotFoundError(recipientId))
    }
    return {} as any
  }
}
