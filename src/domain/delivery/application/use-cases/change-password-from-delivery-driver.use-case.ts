import { Either } from '@/core/either'

type ChangePasswordFromDeliveryDriverUseCaseInput = {}

type ChangePasswordFromDeliveryDriverUseCaseOutput = Either<void, void>

export class ChangePasswordFromDeliveryDriverUseCase {
  constructor() {}

  public async execute(
    request: ChangePasswordFromDeliveryDriverUseCaseInput,
  ): Promise<ChangePasswordFromDeliveryDriverUseCaseOutput> {
    return {} as any
  }
}
