import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentToPost } from '../_models/commentToPost';
import { env } from '../_env/env';
import { Comment } from '../_models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentItemService {
  private http: HttpClient = inject(HttpClient);

  public createReplyRequest(commentRequest: Comment): Observable<{ comment: CommentToPost }> {
    return this.http.post<{ comment: CommentToPost }>(env.commentUri, commentRequest);
  }

  public likeCommentRequest(commentId: string): Observable<any> {
    return this.http.post<any>(`${env.commentUri}/${commentId}/like`, null);
  }
}
