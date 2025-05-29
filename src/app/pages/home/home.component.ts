import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiInteractionService } from '../../services/ui-interaction.service';
import { AuthWidgetComponent } from '../../components/auth-widget/auth-widget.component'; // Import AuthWidgetComponent

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterModule, AuthWidgetComponent] // Add AuthWidgetComponent to imports
})
export class HomeComponent {
  currentYear = new Date().getFullYear();

  constructor(private uiInteractionService: UiInteractionService) {}

  // triggerLoginPanel() was removed as the auth widget is now directly embedded
  // and handles its own visibility based on auth state when embedded.
}
