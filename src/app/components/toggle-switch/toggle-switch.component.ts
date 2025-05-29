import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-block cursor-pointer" (click)="toggle()">
      <div class="relative w-9 h-5 rounded-full border shadow-sm transition-all duration-150"
           [ngClass]="isActive ? 'bg-blue-500/50 backdrop-blur-sm border-white/20' : 'bg-white/30 backdrop-blur-sm border-white/20'">
        <span class="absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 shadow transition-transform duration-200 ease-in-out"
              [style.transform]="isActive ? 'translateX(16px)' : 'translateX(0)'">
        </span>
      </div>
    </div>
  `,
  styleUrls: []
})
export class ToggleSwitchComponent {
  @Input() isActive: boolean = false;
  @Output() toggled = new EventEmitter<boolean>();

  toggle() {
    this.isActive = !this.isActive;
    this.toggled.emit(this.isActive);
  }
}
