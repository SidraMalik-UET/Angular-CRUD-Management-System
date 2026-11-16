import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tickets } from './tickets/tickets';

@Component({
  imports: [RouterOutlet,Tickets],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Angular_Helpdesk');
}
