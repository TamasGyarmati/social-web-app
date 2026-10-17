import { Injectable } from '@angular/core';
import { ChangeEmailRequest } from '../_models/changeEmailRequest';
import { ChangePasswordRequest } from '../_models/changePasswordRequest';
import { UserUpdate } from '../_models/userUpdate';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { env } from '../_env/env';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHandlingService {
  private http: HttpClient = inject(HttpClient);

  public whoami(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(env.whoamiUri);
  }

  public deleteUserRequest(): Observable<unknown> {
    return this.http.delete(env.userDeleteUri);
  }

  public updateAvatarRequest(formData: FormData): Observable<{ avatarUrl: string }> {
    return this.http.post<{ avatarUrl: string }>(env.userPostAvatarUri, formData);
  }

  public updateUserRequest(userUpdate: UserUpdate): Observable<unknown> {
    return this.http.put(env.userUpdateUri, userUpdate);
  }

  public updatePasswordRequest(passwordUpdate: ChangePasswordRequest): Observable<unknown> {
    return this.http.put(env.userUpdatePasswordUri, passwordUpdate);
  }

  public updateMailRequest(emailUpdate: ChangeEmailRequest): Observable<unknown> {
    return this.http.put(env.userUpdateEmailUri, emailUpdate);
  }
}
