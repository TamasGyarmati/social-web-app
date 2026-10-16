import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../_env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditPostService {
  private http = inject(HttpClient);

  public updatePost(postId: string, formData: FormData): Observable<unknown> {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    return this.http.put(`${env.postUri}/${postId}`, formData, { headers: headers });
  }
}
