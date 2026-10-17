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

@Component({
  selector: 'app-user-handling',
  templateUrl: './user-handling.html',
  imports: [MATERIAL_IMPORTS, CommonModule, ReactiveFormsModule, FormsModule],
  styleUrl: './user-handling.scss',
})
export class UserHandling implements OnInit {
  public selectedFileName: string | null = null;

  public user = signal<User | null>(null);
  public isUserUpdateEnabled = signal(false);

  public auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private router = inject(Router);
  private http = inject(HttpClient);
  private matBar = inject(MatSnackBar);

  public userForm = new FormGroup({
    userName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public imageForm = new FormControl<File | null>(null, {
    validators: [Validators.required],
  });

  public passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: (form) =>
        form.get('newPassword')?.value === form.get('confirmPassword')?.value
          ? null
          : { passwordMismatch: true },
    },
  );

  public newEmailForm = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  ngOnInit(): void {
    this.userForm.disable();
    this.whoami();
  }

  private whoami(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http.get<{ user: User }>(`${env.whoamiUri}`, { headers: headers }).subscribe(
      (success) => {
        this.user.set(success.user);
        this.userForm.patchValue({
          userName: success.user.userName,
          firstName: success.user.firstName,
          lastName: success.user.lastName,
        });
        console.log('::SUCCESS::', success);
      },
      (error) => {
        console.log('::ERROR::', error);
      },
    );
  }

  private deleteUser(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http.delete(env.userDeleteUri, { headers: headers }).subscribe(
      (success) => {
        console.log('::SUCCESS::', success);
        this.auth.logout();
        this.router.navigate(['/login']);
        this.matBar.open('User successfully deleted.', 'Close', { duration: 3000 });
      },
      (error) => {
        console.log('::ERROR::', error);
        this.matBar.open(error.error.message, 'Close', { duration: 3000 });
      },
    );
  }

  public updateAvatar(): void {
    if (this.imageForm.invalid) {
      this.imageForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const image = this.imageForm.value;

    if (image) {
      formData.append('Image', image);
    }

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http.post<{ avatarUrl: string }>(env.userPostAvatarUri, formData, { headers }).subscribe(
      (success) => {
        this.auth.user.update((user) =>
          user
            ? {
                ...user,

                avatarUrl: success.avatarUrl,
              }
            : user,
        );

        this.selectedFileName = null;
        this.imageForm.reset();
        this.matBar.open('Successfully uploaded the avatar', 'Close', { duration: 3000 });
        console.log('::SUCCESS::', success);
      },
      (error) => {
        console.log('::ERROR::', error);
      },
    );
  }

  public updateUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    const userUpdate: UserUpdate = this.userForm.getRawValue();

    this.http.put(env.userUpdateUri, userUpdate, { headers: headers }).subscribe(
      (success) => {
        this.auth.user.update((user) =>
          user
            ? {
                ...user,
                userName: this.userForm.controls.userName.value,
                firstName: this.userForm.controls.firstName.value,
                lastName: this.userForm.controls.lastName.value,
              }
            : user,
        );
        this.whoami();
        this.toggleUserUpdate();
        this.matBar.open('Successfully updated your profile', 'Close', { duration: 3000 });
        console.log('::SUCCESS::', success);
      },
      (error) => {
        console.log('::ERROR::', error);
        this.matBar.open(error.error.message, 'Close', { duration: 3000 });
      },
    );
  }

  public updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    const passwordUpdate: ChangePasswordRequest = {
      oldPassword: this.passwordForm.controls.currentPassword.value,
      newPassword: this.passwordForm.controls.newPassword.value,
    };

    this.http.put(env.userUpdatePasswordUri, passwordUpdate, { headers: headers }).subscribe(
      (success) => {
        this.matBar.open('Successfully updated your profile', 'Close', { duration: 3000 });
        this.passwordForm.reset();
        this.passwordForm.markAsPristine();
        this.passwordForm.markAsUntouched();
        console.log('::SUCCESS::', success);
      },
      (error) => {
        this.matBar.open(error.error.message, 'Close', { duration: 3000 });
        this.passwordForm.reset();
        this.passwordForm.markAsPristine();
        this.passwordForm.markAsUntouched();
        console.log('::ERROR::', error);
      },
    );
  }

  public updateMail(): void {
    if (this.newEmailForm.invalid) {
      this.newEmailForm.markAllAsTouched();
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    const emailUpdate: ChangeEmailRequest = {
      newEmail: this.newEmailForm.getRawValue(),
    };

    this.http.put(env.userUpdateEmailUri, emailUpdate, { headers: headers }).subscribe(
      (success) => {
        console.log('::SUCCESS::', success);
        this.matBar.open('Confirmation link to your new email was sent out!', 'Close', {
          duration: 3000,
        });
        this.newEmailForm.reset();
        this.passwordForm.markAsPristine();
        this.passwordForm.markAsUntouched();
      },
      (error) => {
        console.log('::ERROR::', error);
        this.matBar.open(error.error.message, 'Close', { duration: 3000 });
        this.newEmailForm.reset();
        this.passwordForm.markAsPristine();
        this.passwordForm.markAsUntouched();
      },
    );
  }

  public openDeleteUserDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DeleteUserDialog, {
      width: '460px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteUser();
      }
    });
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.imageForm.setValue(input.files[0]);
    }
  }

  public toggleUserUpdate(): void {
    this.isUserUpdateEnabled.update((value) => !value);

    if (this.isUserUpdateEnabled()) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  public checkFileName(): boolean {
    return this.selectedFileName === null;
  }
}
