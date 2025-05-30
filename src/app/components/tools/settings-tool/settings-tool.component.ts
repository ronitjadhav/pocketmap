import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-tool',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 space-y-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Settings</h3>
      
      <!-- Map Settings -->
      <div class="space-y-4">
        <h4 class="text-md font-medium text-gray-800 dark:text-gray-200">Map Settings</h4>
        
        <!-- Default Zoom Level -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Default Zoom Level</label>
          <div class="flex items-center space-x-3">
            <input
              type="range"
              min="1"
              max="18"
              [value]="defaultZoom()"
              (input)="setDefaultZoom($event)"
              class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem]">{{ defaultZoom() }}</span>
          </div>
        </div>

        <!-- Auto-save Interval -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-save Interval (minutes)</label>
          <select
            [value]="autoSaveInterval()"
            (change)="setAutoSaveInterval($event)"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Disabled</option>
            <option value="1">1 minute</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </div>

        <!-- Show Coordinates -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Coordinates</label>
          <button
            (click)="toggleShowCoordinates()"
            [ngClass]="showCoordinates() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              [ngClass]="showCoordinates() ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>

        <!-- Show Scale Bar -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Scale Bar</label>
          <button
            (click)="toggleShowScaleBar()"
            [ngClass]="showScaleBar() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              [ngClass]="showScaleBar() ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>
      </div>

      <!-- Drawing Settings -->
      <div class="space-y-4">
        <h4 class="text-md font-medium text-gray-800 dark:text-gray-200">Drawing Settings</h4>
        
        <!-- Default Drawing Color -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Default Drawing Color</label>
          <div class="flex items-center space-x-3">
            <input
              type="color"
              [value]="defaultDrawingColor()"
              (change)="setDefaultDrawingColor($event)"
              class="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ defaultDrawingColor() }}</span>
          </div>
        </div>

        <!-- Default Stroke Width -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Default Stroke Width</label>
          <div class="flex items-center space-x-3">
            <input
              type="range"
              min="1"
              max="10"
              [value]="defaultStrokeWidth()"
              (input)="setDefaultStrokeWidth($event)"
              class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem]">{{ defaultStrokeWidth() }}px</span>
          </div>
        </div>

        <!-- Snap to Grid -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Snap to Grid</label>
          <button
            (click)="toggleSnapToGrid()"
            [ngClass]="snapToGrid() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              [ngClass]="snapToGrid() ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>
      </div>

      <!-- Application Settings -->
      <div class="space-y-4">
        <h4 class="text-md font-medium text-gray-800 dark:text-gray-200">Application</h4>
        
        <!-- Language -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select
            [value]="language()"
            (change)="setLanguage($event)"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <!-- Enable Notifications -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Notifications</label>
          <button
            (click)="toggleNotifications()"
            [ngClass]="enableNotifications() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              [ngClass]="enableNotifications() ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>

        <!-- Enable Analytics -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Analytics</label>
          <button
            (click)="toggleAnalytics()"
            [ngClass]="enableAnalytics() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              [ngClass]="enableAnalytics() ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="space-y-4">
        <h4 class="text-md font-medium text-gray-800 dark:text-gray-200">Data Management</h4>
        
        <div class="space-y-3">
          <button
            (click)="exportSettings()"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Export Settings
          </button>
          
          <button
            (click)="importSettings()"
            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            Import Settings
          </button>
          
          <button
            (click)="resetSettings()"
            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Custom range slider styling */
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      border: none;
    }

    /* Custom color input styling */
    input[type="color"] {
      -webkit-appearance: none;
      border: none;
      cursor: pointer;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
  `]
})
export class SettingsToolComponent {
  // Map Settings
  defaultZoom = signal(10);
  autoSaveInterval = signal(5);
  showCoordinates = signal(true);
  showScaleBar = signal(true);

  // Drawing Settings
  defaultDrawingColor = signal('#3b82f6');
  defaultStrokeWidth = signal(2);
  snapToGrid = signal(false);

  // Application Settings
  language = signal('en');
  enableNotifications = signal(true);
  enableAnalytics = signal(false);

  setDefaultZoom(event: Event) {
    const target = event.target as HTMLInputElement;
    this.defaultZoom.set(parseInt(target.value));
  }

  setAutoSaveInterval(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.autoSaveInterval.set(parseInt(target.value));
  }

  toggleShowCoordinates() {
    this.showCoordinates.set(!this.showCoordinates());
  }

  toggleShowScaleBar() {
    this.showScaleBar.set(!this.showScaleBar());
  }

  setDefaultDrawingColor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.defaultDrawingColor.set(target.value);
  }

  setDefaultStrokeWidth(event: Event) {
    const target = event.target as HTMLInputElement;
    this.defaultStrokeWidth.set(parseInt(target.value));
  }

  toggleSnapToGrid() {
    this.snapToGrid.set(!this.snapToGrid());
  }

  setLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.language.set(target.value);
  }

  toggleNotifications() {
    this.enableNotifications.set(!this.enableNotifications());
  }

  toggleAnalytics() {
    this.enableAnalytics.set(!this.enableAnalytics());
  }

  exportSettings() {
    const settings = {
      map: {
        defaultZoom: this.defaultZoom(),
        autoSaveInterval: this.autoSaveInterval(),
        showCoordinates: this.showCoordinates(),
        showScaleBar: this.showScaleBar()
      },
      drawing: {
        defaultColor: this.defaultDrawingColor(),
        defaultStrokeWidth: this.defaultStrokeWidth(),
        snapToGrid: this.snapToGrid()
      },
      application: {
        language: this.language(),
        enableNotifications: this.enableNotifications(),
        enableAnalytics: this.enableAnalytics()
      }
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pocketmap-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            
            // Apply imported settings
            if (settings.map) {
              if (settings.map.defaultZoom) this.defaultZoom.set(settings.map.defaultZoom);
              if (settings.map.autoSaveInterval !== undefined) this.autoSaveInterval.set(settings.map.autoSaveInterval);
              if (settings.map.showCoordinates !== undefined) this.showCoordinates.set(settings.map.showCoordinates);
              if (settings.map.showScaleBar !== undefined) this.showScaleBar.set(settings.map.showScaleBar);
            }
            
            if (settings.drawing) {
              if (settings.drawing.defaultColor) this.defaultDrawingColor.set(settings.drawing.defaultColor);
              if (settings.drawing.defaultStrokeWidth) this.defaultStrokeWidth.set(settings.drawing.defaultStrokeWidth);
              if (settings.drawing.snapToGrid !== undefined) this.snapToGrid.set(settings.drawing.snapToGrid);
            }
            
            if (settings.application) {
              if (settings.application.language) this.language.set(settings.application.language);
              if (settings.application.enableNotifications !== undefined) this.enableNotifications.set(settings.application.enableNotifications);
              if (settings.application.enableAnalytics !== undefined) this.enableAnalytics.set(settings.application.enableAnalytics);
            }
            
            alert('Settings imported successfully!');
          } catch (error) {
            alert('Error importing settings. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reset to default values
      this.defaultZoom.set(10);
      this.autoSaveInterval.set(5);
      this.showCoordinates.set(true);
      this.showScaleBar.set(true);
      this.defaultDrawingColor.set('#3b82f6');
      this.defaultStrokeWidth.set(2);
      this.snapToGrid.set(false);
      this.language.set('en');
      this.enableNotifications.set(true);
      this.enableAnalytics.set(false);
      
      alert('Settings have been reset to defaults.');
    }
  }
}