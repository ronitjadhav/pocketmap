import { Injectable, signal, Type } from '@angular/core';

export interface ToolConfig {
  id: string;
  title: string;
  icon: string;
  component: Type<any>;
  description?: string;
}

export interface FloatingSidebarState {
  isOpen: boolean;
  activeTool: ToolConfig | null;
  isMobile: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FloatingSidebarService {
  private state = signal<FloatingSidebarState>({
    isOpen: false,
    activeTool: null,
    isMobile: false
  });

  // Read-only signal for components to subscribe to
  readonly sidebarState = this.state.asReadonly();

  constructor() {
    this.checkMobileState();
    window.addEventListener('resize', () => this.checkMobileState());
  }

  private checkMobileState() {
    const isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
    this.state.update(state => ({ ...state, isMobile }));
  }

  openTool(tool: ToolConfig) {
    this.state.update(state => ({
      ...state,
      isOpen: true,
      activeTool: tool
    }));
  }

  closeSidebar() {
    this.state.update(state => ({
      ...state,
      isOpen: false,
      activeTool: null
    }));
  }

  toggleTool(tool: ToolConfig) {
    const currentState = this.state();
    
    if (currentState.isOpen && currentState.activeTool?.id === tool.id) {
      this.closeSidebar();
    } else {
      this.openTool(tool);
    }
  }

  isToolActive(toolId: string): boolean {
    const state = this.state();
    return state.isOpen && state.activeTool?.id === toolId;
  }
}
