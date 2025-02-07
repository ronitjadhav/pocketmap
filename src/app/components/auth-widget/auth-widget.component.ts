import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  bootstrapBoxArrowInRight, 
  bootstrapBoxArrowRight,
  bootstrapPersonCircle,
  bootstrapEnvelope,
  bootstrapLock,
  bootstrapX,
  bootstrapArrowRight
} from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-auth-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  providers: [provideIcons({ 
    bootstrapBoxArrowInRight, 
    bootstrapBoxArrowRight,
    bootstrapPersonCircle,
    bootstrapEnvelope,
    bootstrapLock,
    bootstrapX,
    bootstrapArrowRight
  })],
  templateUrl: './auth-widget.component.html',
  styles: [``]
})
export class AuthWidgetComponent {
  showLoginForm = false;
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(public authService: AuthService) {}

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    if (this.showLoginForm) {
      // Clear any previous error and reset fields when opening the form.
      this.error = '';
      this.email = '';
      this.password = '';
    }
  }

  async onLogin() {
    try {
      await this.authService.login(this.email, this.password);
      // Close the form on successful login.
      this.showLoginForm = false;
    } catch (err: any) {
      console.error('Login error:', err);
      this.error = 'Login failed: ' + (err.message || 'Invalid credentials');
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
