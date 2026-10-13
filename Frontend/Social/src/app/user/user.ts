import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { env } from '../_env/env';
import { User as UserModel } from '../_models/user';
import { ActivatedRoute } from '@angular/router';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FollowResponse } from '../_models/followResponse';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FollowDialog } from '../follow-dialog/follow-dialog';

@Component({
  selector: 'app-user',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  public user = signal<UserModel | null>(null);
  public isLoading = signal<boolean>(true);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private matBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  public apiUri = env.apiUri;
  public isFollowing = signal<boolean | null>(null);
  public isFollowingMe = signal<boolean | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');

      if (userId) {
        this.getUserById(userId);
      }
    });
  }

  getUserById(userId: string): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http
      .get<{ user: UserModel }>(`${env.userGetByIdUri}/${userId}`, { headers: headers })
      .subscribe(
        (success) => {
          console.log('::SUCCESS::', success);
          this.user.set(success.user);
          this.isFollowing.set(success.user.isFollowing);
          this.isFollowingMe.set(success.user.isFollowingMe);
          this.isLoading.set(false);
        },
        (error) => {
          console.log('::ERROR::', error);
        },
      );
  }

  followUser(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (!userId) {
      console.error('User ID not found in route!');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http
      .post<FollowResponse>(`${env.userFollowByIdUri}/${userId}`, {}, { headers: headers })
      .subscribe({
        next: (success) => {
          console.log('::SUCCESS::', success);
          this.getUserById(userId);
          this.matBar.open(success.message, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.log('::ERROR::', error);
          this.matBar.open(error.error.message, 'Close', { duration: 3000 });
        },
      });
  }

  openDialog(
    type: 'followers' | 'following',
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (!userId) {
      console.error('User ID not found in route!');
      return;
    }

    const dialogRef = this.dialog.open(FollowDialog, {
      width: '440px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        userId: userId,
        type: type,
      },
    });

    /*
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        // mi történjen?
      }
    }); */
  }
}
