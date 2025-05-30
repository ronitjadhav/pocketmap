import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapBoxArrowRight, bootstrapPersonCircle, bootstrapX, bootstrapBoxArrowInRight, bootstrapEnvelope, bootstrapLock, bootstrapArrowRight, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription, firstValueFrom } from 'rxjs'; // Added firstValueFrom
import { UiInteractionService } from '../../services/ui-interaction.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-auth-widget',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgIconComponent, FormsModule, NgClass, ThemeToggleComponent],
  templateUrl: './auth-widget.component.html',
  styleUrls: ['./auth-widget.component.css'],
  providers: [provideIcons({ bootstrapBoxArrowRight, bootstrapPersonCircle, bootstrapX, bootstrapBoxArrowInRight, bootstrapEnvelope, bootstrapLock, bootstrapArrowRight, bootstrapGithub })]
})
export class AuthWidgetComponent implements OnInit, OnDestroy {
  @Input() embedded = false;

  showLoginForm = false;
  isLoading = false;
  error: string | null = null;
  email = '';
  password = '';
  showMobileMenu = false; // For mobile dropdown menu
  private loginTriggerSubscription!: Subscription;
  private authSubscription!: Subscription; // To manage auth state changes

  constructor(
    public authService: AuthService,
    private uiInteractionService: UiInteractionService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (this.embedded && !user) {
        this.showLoginForm = true; // Show form if embedded and not logged in
      } else if (this.embedded && user) {
        this.showLoginForm = false; // Hide form if embedded and logged in (user info shown)
      } else if (!this.embedded) {
        this.showLoginForm = false; // CRITICAL: Never show login form if not embedded and not explicitly triggered (which is now removed)
      }
    });

    // The UiInteractionService is no longer used to trigger the non-embedded form.
    // Its role for embedded forms is also minimal as the form shows by default if not logged in.
    // We can potentially remove this subscription or repurpose UiInteractionService if needed elsewhere.
    this.loginTriggerSubscription = this.uiInteractionService.loginPanelTrigger$.subscribe(async () => {
      const user = await firstValueFrom(this.authService.currentUser$); // Get current user state
      if (this.embedded && !user) {
        this.showLoginForm = true;
        this.error = null;
        this.email = '';
        this.password = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loginTriggerSubscription) {
      this.loginTriggerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async toggleLoginForm(): Promise<void> { // Made async to await user check
    if (!this.embedded) {
      // For non-embedded, the only way showLoginForm could be true is if it was set by some legacy trigger.
      // We ensure it's false, as the trigger button is gone.
      this.showLoginForm = false;
    } else {
      // In embedded mode, this method is not reachable via UI elements (X, Cancel are hidden).
      // If called programmatically, ensure form doesn't hide if user is logged out.
      const user = await firstValueFrom(this.authService.currentUser$);
      if (!user) {
        this.showLoginForm = true; // Keep it shown if logged out
        return;
      }
      // If embedded and logged in, toggling would mean hiding user info to show form - generally not desired.
      // For now, let it proceed if somehow called, but this state is unlikely.
    }

    this.error = null;
    if (!this.showLoginForm) {
        this.email = '';
        this.password = '';
    }
  }

  async onLogin(form?: NgForm): Promise<void> {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      await this.authService.login(this.email, this.password);
      this.email = '';
      this.password = '';
    } catch (err: any) {
      this.error = err.message || 'Login failed. Please check your credentials.';
      console.error('Login error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async onLogout(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.showMobileMenu = false;
    try {
      await this.authService.logout();
    } catch (err: any) {
      this.error = err.message || 'Logout failed. Please try again.';
      console.error('Logout error:', err);
    } finally {
      this.isLoading = false;
    }
  }
  
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    
    // Close mobile menu when clicking outside
    if (this.showMobileMenu) {
      setTimeout(() => {
        const closeMenu = (e: MouseEvent) => {
          if (!e.target) return;
          const target = e.target as HTMLElement;
          if (!target.closest('.auth-mobile-menu')) {
            this.showMobileMenu = false;
            document.removeEventListener('click', closeMenu);
          }
        };
        document.addEventListener('click', closeMenu);
      }, 0);
    }
  }

  onLoginWithProvider(provider: string) {
    console.log(`Attempting login with ${provider}`);
    // Placeholder for actual provider login logic
    // Example: this.authService.loginWithProvider(provider).subscribe(...);
    this.isLoading = true; // Optionally set loading state
    this.error = null;
    // Simulate API call
    setTimeout(() => {
      console.log(`${provider} login flow would be handled here.`);
      this.isLoading = false;
      // this.error = 'Feature not yet implemented.';
    }, 1500);
  }

  getAvatarUrl(user: any): string | null {
    console.log('AuthWidgetComponent: User object received:', user);
    
    if (!user) {
      console.log('AuthWidgetComponent: User is null or undefined');
      return null;
    }
    
    console.log('AuthWidgetComponent: User object keys:', Object.keys(user));
    
    // PocketBase standard avatar field is often 'avatar' 
    // Check if user has avatar field with a value
    const avatar = user.avatar;
    
    if (!avatar) {
      console.log('AuthWidgetComponent: No avatar found in user object');
      return null;
    }
    
    // Get the collection ID and user ID
    const collectionId = user.collectionId || 'users'; // Default to 'users' if not specified
    const userId = user.id;
    
    if (!userId) {
      console.log('AuthWidgetComponent: User ID is missing');
      return null;
    }

    // Check if avatar is already a full URL
    if (typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://'))) {
      console.log('AuthWidgetComponent: Avatar is already a full URL:', avatar);
      return avatar;
    }
    
    // For avatar fields with multiple files (unlikely for avatar but possible)
    const filename = Array.isArray(avatar) ? avatar[0] : avatar;
    
    // Construct URL using PocketBase's standard file URL format
    // Format: serverUrl/api/files/{collectionId}/{recordId}/{filename}
    const serverUrl = 'http://127.0.0.1:8090'; // Should match what's in AuthService
    const url = `${serverUrl}/api/files/${collectionId}/${userId}/${filename}`;
    
    console.log('AuthWidgetComponent: Avatar URL generated:', url);
    return url;
  }

  getUserNameFromEmail(email: string): string {
    return email.split('@')[0];
  }
}
