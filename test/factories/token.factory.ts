import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Injectable } from '@nestjs/common'

export function makeTokenPayload(
  override: Partial<UserPayload> = {},
): UserPayload {
  return {
    sub: new UniqueEntityId().toString(),
    role: UserRoles.ADMINISTRATOR,
    ...override,
  }
}

@Injectable()
export class TokenFactory {
  constructor(private readonly encrypter: Encrypter) {}

  async make(override: Partial<UserPayload> = {}): Promise<string> {
    const tokenPayload = makeTokenPayload(override)

    const token = await this.encrypter.encrypt(tokenPayload)

    return token
  }
}
