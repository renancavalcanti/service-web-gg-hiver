import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Capsule } from '../models/capsule.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private readonly socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  joinRoom(userId: string): void{
    this.socket.emit('join', userId);
  }

  onCapsuleCreate(): Observable<Capsule>{
    return new Observable(observer => {
      this.socket.on('capsule:created', (capsule: Capsule) => {
        observer.next(capsule);
      });
    })
  }
}
