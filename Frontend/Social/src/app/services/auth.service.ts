import { User } from '../_models/user';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../env/env';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn = signal(false);
  public user = signal<User | null>(null);

  private http = inject(HttpClient);

  constructor(private router: Router) {
    this.checkIfLoggedIn();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http.get<{ user: User }>(`${env.whoamiUri}`, { headers: headers }).subscribe(
      (success) => {
        this.user.set(success.user);
        console.log('::SUCCESS_USER::', success);
      },
      (error) => {
        console.log('::ERROR::', error);
      },
    );
  }

  public canActivate(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
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
