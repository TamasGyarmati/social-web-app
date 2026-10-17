import { Injectable } from '@angular/core';
import { env } from '../_env/env';
import { UserGetAll } from '../_models/userGetAll';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http: HttpClient = inject(HttpClient);

  public getAllUsersRequest(): Observable<UserGetAll[]> {
    return this.http.get<UserGetAll[]>(env.userGetAllUri);
  }
}
