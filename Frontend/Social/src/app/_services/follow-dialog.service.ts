import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { env } from '../_env/env';
import { GetFollowers } from '../_models/getFollowers';
import { GetFollowings } from '../_models/getFollowings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FollowDialogService {
  private http = inject(HttpClient);

  public getFollowersRequest(userId: string): Observable<{ followers: GetFollowers[] }> {
    return this.http.get<{ followers: GetFollowers[] }>(
      `${env.userGetByIdUri}/${userId}/followers`,
    );
  }

  public getFollowingsRequest(userId: string): Observable<{ followings: GetFollowings[] }> {
    return this.http.get<{ followings: GetFollowings[] }>(
      `${env.userGetByIdUri}/${userId}/followings`,
    );
  }
}
