import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { BCryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BCryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BCryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
