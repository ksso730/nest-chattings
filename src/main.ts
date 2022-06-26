import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 현재 폴더(__dirname: src) 의 상위 ../public
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // static asset을 public으로 지정. nest에서 자동으로 public 하위 디렉토리들을 찾아준다.
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000);
}
bootstrap();
