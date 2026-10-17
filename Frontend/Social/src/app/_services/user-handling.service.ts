import { Injectable } from '@angular/core';
import { ChangeEmailRequest } from '../_models/changeEmailRequest';
import { ChangePasswordRequest } from '../_models/changePasswordRequest';
import { UserUpdate } from '../_models/userUpdate';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../_env/env';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHandlingService {
  private http: HttpClient = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem(env.jwtAccessToken)}`,
    });
  }

  public whoami(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(env.whoamiUri, { headers: this.getAuthHeaders() });
  }

  public deleteUser(): Observable<unknown> {
    return this.http.delete(env.userDeleteUri, { headers: this.getAuthHeaders() });
  }

  public updateAvatar(formData: FormData): Observable<{ avatarUrl: string }> {
    return this.http.post<{ avatarUrl: string }>(env.userPostAvatarUri, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  public updateUser(userUpdate: UserUpdate): Observable<unknown> {
    return this.http.put(env.userUpdateUri, userUpdate, { headers: this.getAuthHeaders() });
  }

  public updatePassword(passwordUpdate: ChangePasswordRequest): Observable<unknown> {
    return this.http.put(env.userUpdatePasswordUri, passwordUpdate, {
      headers: this.getAuthHeaders(),
    });
  }

  public updateMail(emailUpdate: ChangeEmailRequest): Observable<unknown> {
    return this.http.put(env.userUpdateEmailUri, emailUpdate, { headers: this.getAuthHeaders() });
  }
}
