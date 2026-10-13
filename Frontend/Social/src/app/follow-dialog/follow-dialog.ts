import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { env } from '../_env/env';
import { GetFollowers } from '../_models/getFollowers';
import { GetFollowings } from '../_models/getFollowings';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FollowDialogData {
  userId: string;
  type: 'followers' | 'following';
}

@Component({
  selector: 'app-follow-dialog',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, RouterLink],
  templateUrl: './follow-dialog.html',
  styleUrl: './follow-dialog.scss',
})
export class FollowDialog implements OnInit {
  public data = inject<FollowDialogData>(MAT_DIALOG_DATA);
  private http = inject(HttpClient);
  private dialogRef = inject(MatDialogRef<FollowDialog>);
  public isLoading = signal<boolean>(true);
  public followers = signal<GetFollowers[] | null>(null);
  public followings = signal<GetFollowings[] | null>(null);
  public apiUri = env.apiUri;

  ngOnInit(): void {
    if (this.data.type === 'followers') {
      this.getFollowers();
    } else {
      this.getFollowings();
    }
  }

  private getFollowers(): void {
    const userId = this.data.userId;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http
      .get<{ followers: GetFollowers[] }>(`${env.userGetByIdUri}/${userId}/followers`, {
        headers: headers,
      })
      .subscribe(
        (success) => {
          console.log('::SUCCESS:', success);
          this.isLoading.set(false);
          this.followers.set(success.followers);
        },
        (error) => {
          console.log('::ERROR:', error);
        },
      );
  }

  private getFollowings(): void {
    const userId = this.data.userId;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http
      .get<{ followings: GetFollowings[] }>(`${env.userGetByIdUri}/${userId}/followings`, {
        headers: headers,
      })
      .subscribe(
        (success) => {
          console.log('::SUCCESS:', success);
          this.isLoading.set(false);
          this.followings.set(success.followings);
        },
        (error) => {
          console.log('::ERROR:', error);
        },
      );
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
