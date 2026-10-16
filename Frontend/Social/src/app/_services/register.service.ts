import { RegisterError } from '../_models/registerError';
import { inject, Injectable } from '@angular/core';
import { env } from '../_env/env';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Register as RegisterModel } from '../_models/register';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http: HttpClient = inject(HttpClient);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  public createRegisterRequest(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userName: string,
  ): void {
    const registerRequestDto: RegisterModel = {
      email: email ?? '',
      password: password ?? '',
      firstName: firstName,
      lastName: lastName,
      userName: userName,
    };

    this.http.post(`${env.authRegisterUri}`, registerRequestDto).subscribe(
      (success) => {
        console.log('::SUCCESS::', success);
        this.router.navigate(['/login']);
        this.snackBar.open(
          'Register was successful! We have sent you a confirmation link to your email, you must accept the link to login.',
          'Close',
          { duration: 5000 },
        );
      },
      (error) => {
        console.log('::ERROR::', error);
        const errors = error.error as RegisterError[];
        let errorString = '';
        errors.forEach((x) => (errorString += `${x.description}, `));
        this.snackBar.open(errorString, 'Close', { duration: 5000 });
      },
    );
  }
}
