import { UserUpdate } from '../_models/userUpdate';
import { User } from '../_models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../env/env';
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
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-handling',
  templateUrl: './user-handling.html',
  imports: [MATERIAL_IMPORTS, CommonModule, ReactiveFormsModule, FormsModule],
  styleUrl: './user-handling.scss',
})
export class UserHandling implements OnInit {
  public user = signal<User | null>(null);
  public isUserUpdateEnabled = signal(false);
  public selectedFileName: string | null = null;
  public auth = inject(AuthService);

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

  public postForm = new FormGroup({
    image: new FormControl<File | null>(null, {
      validators: [Validators.required],
    }),
  });

  private http = inject(HttpClient);
  private matBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.userForm.disable();
    this.whoami();
  }

  updateAvatar(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const image = this.postForm.controls.image.value;

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
        this.postForm.reset();
        this.matBar.open('Successfully uploaded the avatar', 'Close', { duration: 3000 });
        console.log('::SUCCESS::', success);
      },
      (error) => {
        console.log('::ERROR::', error);
      },
    );
  }

  updateUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    const userUpdate: UserUpdate = this.userForm.getRawValue();
    console.log(userUpdate);

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
      },
    );
  }

  whoami(): void {
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

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.postForm.patchValue({
        image: input.files[0],
      });
    }
  }

  toggleUserUpdate(): void {
    this.isUserUpdateEnabled.update((value) => !value);

    if (this.isUserUpdateEnabled()) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  checkFileName(): boolean {
    return this.selectedFileName === null;
  }
}
