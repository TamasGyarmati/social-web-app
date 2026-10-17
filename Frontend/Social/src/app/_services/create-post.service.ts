import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { env } from '../_env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreatePostService {
  private http: HttpClient = inject(HttpClient);

  public createPostRequest(formData: FormData): Observable<unknown> {
    return this.http.post(env.postUri, formData);
  }
}
