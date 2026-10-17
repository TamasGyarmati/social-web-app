import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentToPost } from '../_models/commentToPost';
import { env } from '../_env/env';
import { Comment } from '../_models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http: HttpClient = inject(HttpClient);

  public createCommentRequest(commentRequest: Comment): Observable<{ comment: CommentToPost }> {
    return this.http.post<{ comment: CommentToPost }>(env.commentUri, commentRequest);
  }
}
