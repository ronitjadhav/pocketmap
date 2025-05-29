import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ThemeService } from './services/theme.service';

// Function to initialize the theme service
function initializeThemeService(themeService: ThemeService) {
  return () => {};
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    ThemeService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeThemeService,
      deps: [ThemeService],
      multi: true
    }
  ]
};
