import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway implements OnGatewayInit {
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('constructor');
  }
  // afterInit() :gateway가 실행될 때, constructor 다음으로 가장먼저 실행됨
  afterInit() {
    this.logger.log('init');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconneceted ${socket.id} ${socket.nsp.name}`);
    // LOG [chat] disconneceted gRu5SBIZMmkTWPmWAAAD /chattings
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`conneceted ${socket.id} ${socket.nsp.name}`);
    // LOG [chat] conneceted gRu5SBIZMmkTWPmWAAAD /chattings
  }
  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('user_connected', username);
    return username;
  }
}
