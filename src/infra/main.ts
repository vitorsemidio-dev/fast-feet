import { AppModule } from '@/infra/app.module'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await app.listen(3333)
}
bootstrap()
