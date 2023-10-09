import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { BCryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BCryptHasher,
    },
  ],
  exports: [HashGenerator],
})
export class CryptographyModule {}
