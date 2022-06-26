import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor');
  }
  // afterInit() :gateway가 실행될 때, constructor 다음으로 가장먼저 실행됨
  afterInit() {
    this.logger.log('init');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
    this.logger.log(`disconneceted ${socket.id} ${socket.nsp.name}`);
    // LOG [chat] disconneceted gRu5SBIZMmkTWPmWAAAD /chattings
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`conneceted ${socket.id} ${socket.nsp.name}`);
    // LOG [chat] conneceted gRu5SBIZMmkTWPmWAAAD /chattings
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    let uname = username;
    const exist = await this.socketModel.exists({ username: uname });
    if (exist) {
      uname = `${username}_${Math.floor(Math.random() * 100)}`;
    }
    await this.socketModel.create({
      id: socket.id,
      username: uname,
    });
    socket.broadcast.emit('user_connected', uname);
    return uname;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });
    await this.chattingModel.create({
      user: socketObj,
      chat: chat,
    });
    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username,
    });
  }
}
