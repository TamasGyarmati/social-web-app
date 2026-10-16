import { inject, signal } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { env } from '../_env/env';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterLink, MatAnchor, FormsModule, MATERIAL_IMPORTS],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  public readonly apiUri = env.apiUri;
  public readonly isMobileMenuOpen = signal<boolean>(false);

  public auth: AuthService = inject(AuthService);

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  public logout(): void {
    this.auth.logout();
  }
}
