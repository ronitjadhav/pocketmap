import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthWidgetComponent } from './components/auth-widget/auth-widget.component';
import { MapViewComponent } from './map/map-view/map-view.component';
import { AuthService } from './services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  imports: [
    AuthWidgetComponent, 
    MapViewComponent, 
    NgIf, 
    AsyncPipe, 
    HomeComponent,
    ThemeToggleComponent,
    ToolbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
