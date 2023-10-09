import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'

export class FakeHasher implements HashComparer, HashGenerator {
  async compare(plain: string, hashed: string): Promise<boolean> {
    return (await this.hash(plain)) === hashed
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }
}
