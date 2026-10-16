import { inject, Injectable } from '@angular/core';
import { Login as LoginModel } from '../_models/login';
import { Token as TokenModel } from '../_models/token';
import { HttpClient } from '@angular/common/http';
import { env } from '../_env/env';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private http: HttpClient = inject(HttpClient);
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public createLoginRequest(email: string, password: string, rememberMe: boolean): void {
    const loginModel: LoginModel = {
      email: email ?? '',
      password: password ?? '',
      rememberMe: rememberMe,
    };

    this.http.post<TokenModel>(`${env.authLoginUri}`, loginModel).subscribe(
      (success) => {
        console.log('::SUCCESS::', success);

        localStorage.setItem(env.jwtAccessToken, success.accessToken);
        localStorage.setItem(env.jwtAccessTokenExp, success.accessTokenExpireDate);
        localStorage.setItem(env.jwtRefreshToken, success.refreshToken);
        localStorage.setItem(env.jwtRefreshTokenExp, success.refreshTokenExpireDate);

        this.auth.loadUser();

        this.snackBar.open('Login was successful!', 'Close', {
          duration: 5000,
        });

        this.router.navigate(['/feed']);
      },
      (error) => {
        console.log('::ERROR::', error);
        this.snackBar.open(error.error.message, 'Close', { duration: 5000 });
      },
    );
  }
}
