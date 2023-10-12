import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

@Injectable()
export class BCryptHasher implements HashComparer, HashGenerator {
  private HASH_SALT_LENGTH = 8
  async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }

  async hash(payload: string): Promise<string> {
    return hash(payload, this.HASH_SALT_LENGTH)
  }
}
