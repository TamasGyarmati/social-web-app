import { User } from '../_models/user';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../_env/env';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user = signal<User | null>(null);
  public isLoggedIn = signal(false);

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {
    this.checkIfLoggedIn();

    if (this.isLoggedIn()) {
      this.whoami();
    }
  }

  private whoami(): void {
    this.http.get<{ user: User }>(`${env.whoamiUri}`).subscribe(
      (success) => {
        this.user.set(success.user);
        console.log('::SUCCESS::', success);
      },
      (error) => {
        console.log('::ERROR::', error);
      },
    );
  }

  public canActivate(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    return this.isLoggedIn();
  }

  public loadUser(): void {
    this.checkIfLoggedIn();

    if (this.isLoggedIn()) {
      this.whoami();
    } else {
      this.user.set(null);
    }
  }

  public checkIfLoggedIn(): void {
    const token = localStorage.getItem(env.jwtAccessToken);
    const expiration = localStorage.getItem(env.jwtAccessTokenExp);

    if (!token || !expiration) {
      this.isLoggedIn.set(false);
      return;
    }

    const expirationTime = new Date(expiration).getTime();
    const loggedIn = expirationTime > Date.now();

    this.isLoggedIn.set(loggedIn);
  }

  public logout(): void {
    localStorage.removeItem(env.jwtAccessToken);
    localStorage.removeItem(env.jwtAccessTokenExp);
    localStorage.removeItem(env.jwtRefreshToken);
    localStorage.removeItem(env.jwtRefreshTokenExp);

    this.isLoggedIn.set(false);

    this.router.navigate(['/feed']);
  }
}
