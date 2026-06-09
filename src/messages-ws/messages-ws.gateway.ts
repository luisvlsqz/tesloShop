import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway( {cors: true} )
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss!: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}
  
  async handleConnection(client: Socket, ...args: any[]) {
/*     console.log(client.handshake.headers.authentication); */

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);

      /*client.data.user = payload;
      console.log('payload', payload); */

    } catch (error) {
      client.disconnect();
      return;
    }
    

    this.wss.emit('clients-updated', { conectados: this.messagesWsService.getConnectedClients() });
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    /* console.log({ conectados: this.messagesWsService.getConnectedClients() }); */
        
    this.wss.emit('clients-updated', { conectados: this.messagesWsService.getConnectedClients() });

  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    
    // Emite solo al cliente que lo emitió
    /* client.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message'
    }); */
    
    // Emite a todos los clientes conectados menos a mi 
    /* client.broadcast.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message'
    }); */
    
    // Emite a todos los clientes conectados 
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });

  }
}
