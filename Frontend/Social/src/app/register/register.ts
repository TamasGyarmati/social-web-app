import { RegisterError } from '../_models/registerError';
import { inject, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { env } from '../_env/env';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Register as RegisterModel } from '../_models/register';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../_shared/material';

@Component({
  selector: 'app-register',
  imports: [MATERIAL_IMPORTS, CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public password: FormControl = new FormControl('', [Validators.required]);
  public registerModel: RegisterModel = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  };
  public acceptTermsAndConditions: boolean = false;
  public isLoading = signal<boolean>(true);
  public hide = signal<boolean>(true);

  private http: HttpClient = inject(HttpClient);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

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

  public canRegister(): boolean {
    return (
      this.acceptTermsAndConditions &&
      this.registerModel.firstName.trim() !== '' &&
      this.registerModel.lastName.trim() !== '' &&
      this.email.valid &&
      this.password.valid &&
      !this.email.hasError('email')
    );
  }

  public toggleHide() {
    this.hide.set(!this.hide());
  }

  public sendRegisterCredentials(): void {
    const registerRequestDto: RegisterModel = {
      email: this.email.value ?? '',
      password: this.password.value ?? '',
      firstName: this.registerModel.firstName,
      lastName: this.registerModel.lastName,
      userName: this.registerModel.userName,
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
