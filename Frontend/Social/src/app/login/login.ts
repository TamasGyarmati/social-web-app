import { inject, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-login',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public password: FormControl = new FormControl('', [Validators.required]);
  public rememberMe: boolean = false;
  public isLoading = signal<boolean>(true);
  public hide = signal<boolean>(true);

  private loginService = inject(LoginService);

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
    if (!this.checkInput()) {
      return;
    }
    this.loginService.createLoginRequest(this.email.value, this.password.value, this.rememberMe);
  }
}
