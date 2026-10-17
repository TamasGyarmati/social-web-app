import { effect, inject } from '@angular/core';
import { env } from '../_env/env';
import { Component, input, output, signal } from '@angular/core';
import { CommentToPost } from '../_models/commentToPost';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../_models/comment';
import { AuthService } from '../_services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommentItemService } from '../_services/comment-item.service';

@Component({
  selector: 'app-comment-item',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, RouterLink],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.scss',
})
export class CommentItem {
  public apiUri: string = env.apiUri;
  public reply: string = '';

  public allComments = input<CommentToPost[]>([]);
  public comment = input.required<CommentToPost>();
  public activeReplyCommentId = input<string | null>(null);
  public replyCreated = output<CommentToPost>();
  public replyClicked = output<string | null>();
  public commentLiked = output<{
    commentId: string;
    likes: number;
    isLiked: boolean;
  }>();

  public likes = signal<number>(0);
  public isLiked = signal<boolean>(false);
  public showReplyInput = signal<boolean>(false);

  private commentItemService: CommentItemService = inject(CommentItemService);
  public auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    effect(() => {
      this.likes.set(this.comment().likes);
      this.isLiked.set(this.comment().isLiked);
    });
  }

  public get getReplies(): CommentToPost[] {
    return this.allComments().filter((comment) => comment.parentCommentId === this.comment().id);
  }

  public onReplyCreated(reply: CommentToPost): void {
    this.replyCreated.emit(reply);
  }

  public onCommentLiked(event: { commentId: string; likes: number; isLiked: boolean }): void {
    this.commentLiked.emit(event);
  }

  public toggleReplyInput(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.activeReplyCommentId() === this.comment().id) {
      this.replyClicked.emit(null);
    } else {
      this.replyClicked.emit(this.comment().id);
    }
  }

  public createReply(comment: CommentToPost): void {
    const commentRequest: Comment = {
      content: this.reply,
      postId: comment.postId,
      parentCommentId: comment.id,
    };

    this.commentItemService.createReplyRequest(commentRequest).subscribe({
      next: (success) => {
        console.log('::SUCCESS::', success);
        this.replyCreated.emit(success.comment);
        this.reply = '';
        this.showReplyInput.set(false);
      },

      error: (error) => {
        console.log('::ERROR::', error);
      },
    });
  }

  public likeComment(commentId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.commentItemService.likeCommentRequest(commentId).subscribe({
      next: (success) => {
        console.log('::SUCCESS::', success);
        this.likes.set(success.likes);
        this.isLiked.set(success.isLiked);

        this.commentLiked.emit({
          commentId: commentId,
          likes: success.likes,
          isLiked: success.isLiked,
        });
      },

      error: (error) => {
        console.log('::ERROR::', error);
      },
    });
  }
}
