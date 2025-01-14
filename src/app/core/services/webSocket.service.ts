/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthenticationService } from './auth.service';
const SOCKET_SERVER_URL = 'https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/'; // Your Socket.IO server URL
@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private socket: Socket;
  currentRole : string = '';
  userId : any = null;
 
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private authSubscription: Subscription;


  constructor( private authservice: AuthenticationService
  ) {
    this.authSubscription = this.authservice.currentUser$.subscribe(user => {
      if (user) {
      
      this.currentRole = user.role.translation_data[0].name;
       this.userId =  user.id;


      }
    // else{
    //  // console.log('User logged out. Disconnecting socket...');
    //   this.disconnectSocket();
    // }
    });
  }
  Connect(){
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
        //console.log('Hi Socket connected with userId:', this.userId);
        this.registerUser(this.userId.toString());
      } else {
        console.error('userId is not available!');
      }
    });
    this.listenForMessages();
  }
  private listenForMessages() {
    
    this.socket.on('messageFromServer', (message: any) => {
      
      this.messagesSubject.next([...this.messagesSubject.value, message]);
    });
  }
  private registerUser(userId: number) {
    this.socket.emit('registerUser', userId);
  }
  private disconnectSocket() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }
  sendMessage(message: string) {
    const messageData = { userId: this.userId, message }; // Send messages as userId = 1
    this.socket.emit('messageFromClient', messageData);
  }
  ngOnDestroy() {
    // Cleanup subscription and disconnect socket on service destruction
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.disconnectSocket();
  }
}