import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../_env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditPostService {
  private http = inject(HttpClient);

  public updatePost(postId: string, formData: FormData): Observable<unknown> {
    return this.http.put(`${env.postUri}/${postId}`, formData);
  }
}
