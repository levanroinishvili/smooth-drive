import { Component, HostBinding, inject } from '@angular/core';
import { MotionService } from '../../services/motion';
import { mapToColor } from '../../utils/color'

@Component({
  selector: 'smooth-drive-display',
  imports: [],
  templateUrl: './display.html',
  styleUrl: './display.scss'
})
export class Display {
  protected readonly acceleration = inject(MotionService).acceleration()
  @HostBinding('style.--y') get y() {
    return (this.acceleration().percentSafe + 100) / 2
  }

  @HostBinding('style.--ball-color') get ballColor() {
    return mapToColor(this.acceleration().percentSafe)
  }

}
