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

  /**
   * Gets the avatar URL from the PocketBase user record
   * @param user PocketBase user record
   * @returns URL to the user's avatar or null if not available
   */
  getAvatarUrl(user: any): string | null {
    if (user && user.avatar) {
      // We need to construct the URL to the avatar file from PocketBase
      const baseUrl = this.authService.pb.baseUrl;
      return `${baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`;
    }
    return null;
  }

  /**
   * Extracts a displayable name from the user's email if name is not available
   * @param email User's email address
   * @returns A displayable name
   */
  getUserNameFromEmail(email: string): string {
    if (!email) return 'User';
    
    // Extract the part before @ and capitalize the first letter
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }
}
