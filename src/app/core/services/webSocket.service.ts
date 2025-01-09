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
 
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();
  

  constructor( private authservice: AuthenticationService
  ) {
    this.authservice.currentUser$.subscribe(user => {
      if (user) {
      
      this.currentRole = user.role.translation_data[0].name;
      if(this.currentRole !== 'Admin' && user.companyId !== 1){
          this.userId =  user.companyId;
      }
      else
         this.userId =  user.id;


      }});

    this.socket = io(SOCKET_SERVER_URL,{
      transports: ['websocket'],  // Use both WebSocket and Polling (fallback)
      reconnection: true,  // Enable automatic reconnections
      reconnectionAttempts: Infinity,  // Unlimited reconnection attempts
      reconnectionDelay: 1000,  // Reconnect after 1 second delay
      reconnectionDelayMax: 5000  // Max 5 second delay between reconnections
    });
    // Register with userId = 1 after connecting to the socket
    this.socket.on('connect', () => {
      if (this.userId) {
        console.log('Socket connected with userId:', this.userId);
        this.registerUser(this.userId);
      } else {
        console.error('userId is not available!');
      }
    });
    this.listenForMessages();
  }
  private listenForMessages() {
    console.log('i am listening for messages');
    
    this.socket.on('messageFromServer', (message: any) => {
      console.log(message);
      
      this.messagesSubject.next([...this.messagesSubject.value, message]);
    });
  }
  private registerUser(userId: number) {
    this.socket.emit('registerUser', userId);
  }
  sendMessage(message: string) {
    const messageData = { userId: this.userId, message }; // Send messages as userId = 1
    this.socket.emit('messageFromClient', messageData);
  }
}