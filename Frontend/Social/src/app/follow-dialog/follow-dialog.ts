import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { env } from '../_env/env';
import { GetFollowers } from '../_models/getFollowers';
import { GetFollowings } from '../_models/getFollowings';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FollowDialogData } from '../_models/followDialogData';
import { FollowDialogService } from '../_services/follow-dialog.service';

@Component({
  selector: 'app-follow-dialog',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, RouterLink],
  templateUrl: './follow-dialog.html',
  styleUrl: './follow-dialog.scss',
})
export class FollowDialog implements OnInit {
  public apiUri = env.apiUri;

  public followers = signal<GetFollowers[] | null>(null);
  public followings = signal<GetFollowings[] | null>(null);
  public userId = signal<string | null>(null);
  public isLoading = signal<boolean>(true);

  public data: FollowDialogData = inject<FollowDialogData>(MAT_DIALOG_DATA);
  private dialogRef: MatDialogRef<FollowDialog> = inject(MatDialogRef<FollowDialog>);
  private followDialogService: FollowDialogService = inject(FollowDialogService);

  ngOnInit(): void {
    const userId = this.data.userId;

    if (userId) {
      this.userId.set(userId);
    }

    if (this.data.type === 'followers') {
      this.getFollowers();
    } else if (this.data.type === 'following') {
      this.getFollowings();
    }
  }

  private getFollowers(): void {
    const userId = this.userId();
    if (!userId) {
      return;
    }

    this.followDialogService.getFollowersRequest(userId).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        this.followers.set(success.followers);

        console.log('::SUCCESS:', success);
      },

      error: (error) => {
        console.log('::ERROR:', error);
      },
    });
  }

  private getFollowings(): void {
    const userId = this.userId();
    if (!userId) {
      return;
    }

    this.followDialogService.getFollowingsRequest(userId).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        this.followings.set(success.followings);
        console.log('::SUCCESS:', success);
      },

      error: (error) => {
        console.log('::ERROR:', error);
      },
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
