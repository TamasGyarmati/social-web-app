import { env } from '../_env/env';
import { Comment } from '../_models/comment';
import { Component, inject, input, output, signal } from '@angular/core';
import { CommentToPost } from '../_models/commentToPost';
import { CommentItem } from '../comment-item/comment-item';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommentsService } from '../_services/comments.service';

@Component({
  selector: 'app-comments',
  imports: [CommentItem, CommonModule, MATERIAL_IMPORTS, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments {
  public commentContent: string = '';

  public comments = input<CommentToPost[]>([]);
  public postId = input.required<string>();
  public commentCreated = output<CommentToPost>();
  public commentLiked = output<{
    commentId: string;
    likes: number;
    isLiked: boolean;
  }>();
  public replyCreated = output<CommentToPost>();

  public activeReplyCommentId = signal<string | null>(null);

  private router: Router = inject(Router);
  private commentsService: CommentsService = inject(CommentsService);

  public onReplyCreated(reply: CommentToPost): void {
    this.replyCreated.emit(reply);
  }

  public onReplyClicked(commentId: string | null): void {
    this.activeReplyCommentId.set(commentId);
  }

  public onCommentLiked(event: { commentId: string; likes: number; isLiked: boolean }): void {
    this.commentLiked.emit(event);
  }

  // Olyan kommentek amelyeknek nincs parentCommentjük
  public getRootItems(): CommentToPost[] {
    return this.comments().filter((comment) => !comment.parentCommentId);
  }

  public createComment(): void {
    const token = localStorage.getItem(env.jwtAccessToken);
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const commentRequest: Comment = {
      content: this.commentContent,
      postId: this.postId(),
      parentCommentId: null,
    };

    this.commentsService.createCommentRequest(commentRequest).subscribe({
      next: (success) => {
        this.commentCreated.emit(success.comment);
        this.commentContent = '';
        console.log('::SUCCESS::', success);
      },

      error: (error) => {
        console.log('::ERROR::', error);
      },
    });
  }
}
