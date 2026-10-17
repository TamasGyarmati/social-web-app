import { CommentToPost } from '../_models/commentToPost';
import { env } from '../_env/env';
import { getAllPost } from '../_models/getAllPost';
import { inject, signal } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { Comments } from '../comments/comments';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import { EditPostDialog } from '../edit-post-dialog/edit-post-dialog';
import { DeletePostDialog } from '../delete-post-dialog/delete-post-dialog';
import { FeedService } from '../_services/feed.service';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, FormsModule, MATERIAL_IMPORTS, Comments, RouterLink],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit {
  public apiUri: string = env.apiUri;

  public posts = signal<getAllPost[]>([]);
  public currentPosts = signal<getAllPost[]>([]);
  public openedComments = signal<Set<string>>(new Set()); // nyitott kommentek postId-jai
  public comments = signal<Map<string, CommentToPost[]>>(new Map()); // posztok azonosítóihoz vannak a kommentek eltárolva
  public isFiltered = signal<boolean>(false);
  public isDateDescending = signal<boolean>(false);
  public isLoading = signal<boolean>(true);

  public auth: AuthService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private matBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private feedService: FeedService = inject(FeedService);

  ngOnInit(): void {
    this.getAllPosts();
  }

  private getAllPosts(): void {
    this.feedService.getAllPostsRequest().subscribe({
      next: (success) => {
        const sortedPosts = success.sort(
          (a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime(),
        );

        this.posts.set(sortedPosts);
        this.currentPosts.set(sortedPosts);

        this.applyFilters();
        this.isLoading.set(false);

        console.log('::[API] LOADED POSTS::', success);
      },

      error: (error) => {
        console.log('::ERROR::', error);
      },
    });
  }

  public likePost(postId: string): void {
    const token = localStorage.getItem(env.jwtAccessToken);
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.feedService.likePostRequest(postId).subscribe({
      next: (success) => {
        const updatePost = (posts: getAllPost[]) =>
          posts.map((post) =>
            post.id === postId ? { ...post, likes: success.likes, isLiked: success.isLiked } : post,
          );

        this.posts.update(updatePost);
        this.currentPosts.update(updatePost);

        console.log('::[API] POST LIKED::', success);
      },

      error: (error) => {
        console.log('::ERROR::', error);
      },
    });
  }

  public deletePost(post: getAllPost): void {
    this.feedService.deletePostRequest(post).subscribe({
      next: (success) => {
        const deletePost = (posts: getAllPost[]) => posts.filter((x) => x.id !== post.id);

        this.posts.update(deletePost);
        this.currentPosts.update(deletePost);

        this.matBar.open('Successfully deleted the post!', 'Close', { duration: 3000 });
        console.log('::[API] POST DELETED::', success);
      },

      error: (error) => {
        if (error.status == '403') {
          this.matBar.open('Cannot delete post!', 'Close', { duration: 3000 });
        }
        console.log('::ERROR::', error);
      },
    });
  }

  public getComments(postId: string): void {
    const opened = new Set(this.openedComments());

    // ha jelenleg meg van nyitva a komment szekció, zárjuk be
    if (opened.has(postId)) {
      opened.delete(postId);
      this.openedComments.set(opened);
      console.log('--CLOSE COMMENTS--');
      return;
    }

    // ha már betöltöttük a kommenteket, csak megnyitjuk őket (nincs http request fölöslegesen)
    if (this.comments().has(postId)) {
      opened.add(postId);
      this.openedComments.set(opened);
      console.log('--OPEN COMMENTS--\n\t--COMMENTS ALREADY LOADED--');
      return;
    }

    // csak akkor kérjük le a poszthoz a kommenteket, hogy ha még nincsenek betöltve
    if (!this.comments().has(postId)) {
      this.feedService.getCommentsRequest(postId).subscribe({
        next: (success) => {
          const sortedComments = [...success].sort(
            (a, b) => new Date(b.createdAtUnc).getTime() - new Date(a.createdAtUnc).getTime(),
          );

          // berakjuk az összes komment közé
          const comments = new Map(this.comments());
          comments.set(postId, sortedComments);
          this.comments.set(comments);

          // berakjuk a nyitott kommentek közé
          opened.add(postId);
          this.openedComments.set(opened);

          console.log('::[API] GET COMMENTS TO POST::', success);
          console.log('--OPEN COMMENTS--');
        },

        error: (error) => {
          console.log('::ERROR::', error);
        },
      });
    }
  }

  public addComment(postId: string, comment: CommentToPost): void {
    this.comments.update((comments) => {
      const newComments = new Map(comments);
      newComments.set(postId, [comment, ...(newComments.get(postId) ?? [])]);
      return newComments;
    });

    const incrementCommentsCount = (posts: getAllPost[]) =>
      posts.map((post) =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post,
      );

    this.posts.update(incrementCommentsCount);
    this.currentPosts.update(incrementCommentsCount);
  }

  public onReplyCreated(reply: CommentToPost): void {
    this.comments.update((comments) => {
      const newComments = new Map(comments);
      const postComments = newComments.get(reply.postId) ?? [];
      newComments.set(reply.postId, [reply, ...postComments]);
      return newComments;
    });

    const incrementCommentsCount = (posts: getAllPost[]) =>
      posts.map((post) =>
        post.id === reply.postId ? { ...post, commentsCount: post.commentsCount + 1 } : post,
      );

    this.posts.update(incrementCommentsCount);
    this.currentPosts.update(incrementCommentsCount);
  }

  public onCommentLiked(event: { commentId: string; likes: number; isLiked: boolean }): void {
    this.comments.update((comments) => {
      const newComments = new Map(comments);

      for (const [postId, postComments] of newComments) {
        const updatedComments = postComments.map((comment) =>
          comment.id === event.commentId
            ? {
                ...comment,
                likes: event.likes,
                isLiked: event.isLiked,
              }
            : comment,
        );

        newComments.set(postId, updatedComments);
      }

      return newComments;
    });
  }

  private applyFilters(): void {
    let filteredPosts = [...this.posts()]; // spread operator -> shallow másolatot készít, segédváltozó

    if (this.isFiltered()) {
      filteredPosts = filteredPosts.filter((item) => item.creatorById === this.auth.user()?.id);
    }

    if (this.isDateDescending()) {
      filteredPosts.reverse();
    }

    this.currentPosts.set(filteredPosts);
  }

  public toggleFilterByMe(): void {
    this.isFiltered.update((value) => !value);
    this.applyFilters();
  }

  public toggleFilterByDate(): void {
    this.isDateDescending.update((value) => !value);
    this.applyFilters();
  }

  public getDayCount(post: getAllPost): string {
    const now = new Date();
    const created = new Date(post.createdAtUtc);
    const difference = now.getTime() - created.getTime(); // difference in ms
    const result = Math.floor(difference / (1000 * 60 * 60 * 24)); // 86.400.000 ms -> 1 day

    if (result === 0) {
      return 'Posted today';
    } else {
      return `Posted ${result.toString()} days ago`;
    }
  }

  public openDeleteDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    post: getAllPost,
  ): void {
    const dialogRef = this.dialog.open(DeletePostDialog, {
      width: '460px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deletePost(post);
      }
    });
  }

  public openEditDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    post: getAllPost,
  ): void {
    const dialogRef = this.dialog.open(EditPostDialog, {
      width: '460px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        post: post,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllPosts();
      }
    });
  }
}
