import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { env } from '../_env/env';
import { User as UserModel } from '../_models/user';
import { FollowResponse } from '../_models/followResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  public getUserByIdRequest(userId: string): Observable<{ user: UserModel }> {
    return this.http.get<{ user: UserModel }>(`${env.userGetByIdUri}/${userId}`);
  }

  public followUserRequest(userId: string): Observable<FollowResponse> {
    return this.http.post<FollowResponse>(`${env.userFollowByIdUri}/${userId}`, {});
  }
}
