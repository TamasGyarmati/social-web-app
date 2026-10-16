import { inject, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { RegisterService } from '../_services/register.service';

@Component({
  selector: 'app-register',
  imports: [MATERIAL_IMPORTS, CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  public firstName: string = '';
  public lastName: string = '';
  public userName: string = '';
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public password: FormControl = new FormControl('', [Validators.required]);
  public acceptTermsAndConditions: boolean = false;
  public isLoading = signal<boolean>(true);
  public hide = signal<boolean>(true);

  private registerService: RegisterService = inject(RegisterService);

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
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.email.valid &&
      this.password.valid
    );
  }

  public toggleHide() {
    this.hide.set(!this.hide());
  }

  public sendRegisterCredentials(): void {
    if (!this.canRegister) {
      return;
    }

    this.registerService.createRegisterRequest(
      this.email.value,
      this.password.value,
      this.firstName,
      this.lastName,
      this.userName,
    );
  }
}
