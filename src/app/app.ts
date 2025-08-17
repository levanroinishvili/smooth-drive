import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotionService } from './services/motion';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'smooth-drive-root',
  imports: [
    AsyncPipe,
    JsonPipe,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly acceleration$ = inject(MotionService).acceleration$
  // protected readonly motionService = inject(MotionService).requestPermission();

}
