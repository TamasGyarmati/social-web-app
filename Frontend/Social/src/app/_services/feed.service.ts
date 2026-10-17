import { LikePost } from '../_models/likePost';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAllPost } from '../_models/getAllPost';
import { env } from '../_env/env';
import { CommentToPost } from '../_models/commentToPost';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private httpClient: HttpClient = inject(HttpClient);

  public getAllPostsRequest(): Observable<getAllPost[]> {
    return this.httpClient.get<getAllPost[]>(env.postGetAllUri);
  }

  public likePostRequest(postId: string): Observable<LikePost> {
    return this.httpClient.post<LikePost>(`${env.postUri}/${postId}/like`, null);
  }

  public deletePostRequest(post: getAllPost): Observable<unknown> {
    return this.httpClient.delete(`${env.postUri}/${post.id}`);
  }

  public getCommentsRequest(postId: string): Observable<CommentToPost[]> {
    return this.httpClient.get<CommentToPost[]>(`${env.commentGetByPostIdUri}/${postId}`);
  }
}
