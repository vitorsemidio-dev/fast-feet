import { Either } from '@/core/either'

type ChangeOrderStatusToShippedUseCaseInput = {}

type ChangeOrderStatusToShippedUseCaseOutput = Either<void, void>

export class ChangeOrderStatusToShippedUseCase {
  async execute({}: ChangeOrderStatusToShippedUseCaseInput): Promise<ChangeOrderStatusToShippedUseCaseOutput> {
    return {} as any
  }
}
