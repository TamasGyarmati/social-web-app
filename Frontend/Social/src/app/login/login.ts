import { inject, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { Token as TokenModel } from '../_models/token';
import { env } from '../_env/env';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Validators } from '@angular/forms';
import { Login as LoginModel } from '../_models/login';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  public email: FormControl = new FormControl('', [Validators.required]);
  public password: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public rememberMe: boolean = false;
  public isLoading = signal<boolean>(true);
  public hide = signal<boolean>(true);

  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private auth: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.isLoading.set(false);
  }

  get getEmailErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'You must enter a value!';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  get getPasswordErrorMessage(): string {
    if (this.password.hasError('required')) {
      return 'You must enter a value!';
    }

    return this.password.hasError('password') ? 'Not a valid password' : '';
  }

  public checkInput(): boolean {
    return this.email.valid && this.password.valid;
  }

  public toggleHide() {
    this.hide.set(!this.hide());
  }

  public sendLoginCredentials(): void {
    const loginModel: LoginModel = {
      email: this.email.value ?? '',
      password: this.password.value ?? '',
      rememberMe: this.rememberMe,
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
