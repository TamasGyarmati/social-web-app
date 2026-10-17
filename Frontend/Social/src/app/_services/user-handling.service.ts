import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteUserDialog } from '../delete-user-dialog/delete-user-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ChangeEmailRequest } from '../_models/changeEmailRequest';
import { ChangePasswordRequest } from '../_models/changePasswordRequest';
import { UserUpdate } from '../_models/userUpdate';
import { User } from '../_models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../_env/env';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../_shared/material';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserHandlingService {
  public auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private router = inject(Router);
  private http = inject(HttpClient);
  private matBar = inject(MatSnackBar);
}
