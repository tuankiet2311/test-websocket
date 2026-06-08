import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'websocket-demo';

  username = '';
  message = '';
  messages: any[] = [];

  private sub?: Subscription;

  constructor(private ws: WebsocketService) { }

  ngOnInit() {
    this.ws.getMessages().subscribe({
      next: data => this.messages.push(data),
      error: err => console.error(err),
      complete: () => console.log('closed')
    });

    // this.sub = this.ws.getMessages().subscribe(data => {
    //   this.messages.push(data);
    // });
  }

  send() {
    if (!this.message.trim()) {
      return;
    }

    this.ws.sendMessage(this.username, this.message);
    this.message = '';
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
