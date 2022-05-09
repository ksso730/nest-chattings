import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { ChatsGateway } from './chats/chats.gateway';
import { ChatsModule } from './chats/chats.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true, //mongodb url을 읽을 수 있도록 설정
      useUnifiedTopology: true, //최신 mongodb 드라이버 엔진을 사용하도록 설정
      // useFindAndModify: false, // mongoose 버전 6.0 이상부터는 불필요
      // useCreateIndex: true,
    }),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [ChatsGateway],
})
export class AppModule implements NestModule {
  configure() {
    const DEBUG = process.env.MODE === 'dev' ? true : false;
    mongoose.set('debug', DEBUG);
  }
}
