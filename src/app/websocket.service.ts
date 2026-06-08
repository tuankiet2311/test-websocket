// websocket.service.ts

import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    // this.socket$ = webSocket(
    //   'wss://demo.piesocket.com/v3/channel_1?api_key=demo&notify_self'
    // );
    this.socket$ = webSocket({
      url: environment?.apiUrl,
    
      openObserver: {
        next: () => console.log('CONNECTED')
      },
    
      closeObserver: {
        next: (event: CloseEvent) => {
          console.log('DISCONNECTED', event);
        }
      }
    });
  }

  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket$.subscribe({
        next: msg => {
          console.log('MESSAGE:', msg);
          observer.next(msg);
        },
        error: err => {
          console.error('WS ERROR:', err);
          observer.error(err);
        },
        complete: () => {
          console.warn('WS CLOSED');
          observer.complete();
        }
      });
    });
  }

  sendMessage(username: string, message: string) {
    this.socket$.next({
      username,
      message,
      time: new Date().toLocaleTimeString()
    });
  }

  disconnect() {
    this.socket$.complete();
  }
}