import { Either } from '@/core/either'

export type CreateOrderUseCaseInput = {}

export type CreateOrderUseCaseOutput = Either<void, void>

export class CreateOrderUseCase {
  async execute({}: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput> {
    return {} as any
  }
}
