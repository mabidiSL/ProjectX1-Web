/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './auth.service';
const SOCKET_SERVER_URL = 'https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/'; // Your Socket.IO server URL
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  currentRole : string = '';
  userId : any;
 
  private messagesSubject = new BehaviorSubject<{ userId: string; message: string }[]>([]);
  messages$ = this.messagesSubject.asObservable();
  

  constructor( private authservice: AuthenticationService
  ) {
    this.authservice.currentUser$.subscribe(user => {
      if (user) {
      
      this.currentRole = user.role.translation_data[0].name;
      if(this.currentRole !== 'Admin'){
          this.userId =  user.merchantId;
      }
      else
         this.userId =  user.id;


      }});

    this.socket = io(SOCKET_SERVER_URL);
    // Register with userId = 1 after connecting to the socket
    this.socket.on('connect', () => {
      const userId = this.userId; // Hard-coded user ID
      this.registerUser(userId);
    });
    this.listenForMessages();
  }
  private listenForMessages() {
    this.socket.on('messageFromServer', (message: { userId: string; message: string }) => {
      this.messagesSubject.next([...this.messagesSubject.value, message]);
    });
  }
  private registerUser(userId: number) {
    this.socket.emit('registerUser', userId);
  }
  sendMessage(message: string) {
    const messageData = { userId: '1', message }; // Send messages as userId = 1
    this.socket.emit('messageFromClient', messageData);
  }
}