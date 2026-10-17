import { Component, inject, OnInit, signal } from '@angular/core';
import { env } from '../_env/env';
import { User as UserModel } from '../_models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FollowDialog } from '../follow-dialog/follow-dialog';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, RouterLink],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  public apiUri = env.apiUri;

  public user = signal<UserModel | null>(null);
  public userId = signal<string | null>(null);
  public isLoading = signal<boolean>(true);
  public isFollowing = signal<boolean | null>(null);
  public isFollowingMe = signal<boolean | null>(null);

  private route: ActivatedRoute = inject(ActivatedRoute);
  private matBar: MatSnackBar = inject(MatSnackBar);
  readonly dialog: MatDialog = inject(MatDialog);
  public auth: AuthService = inject(AuthService);
  public userService: UserService = inject(UserService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');

      if (userId) {
        this.userId.set(userId);
        this.getUserById(userId);
      }
    });
  }

  private getUserById(userId: string): void {
    this.userService.getUserByIdRequest(userId).subscribe({
      next: (success) => {
        this.isLoading.set(false);

        this.user.set(success.user);

        this.isFollowing.set(success.user.isFollowing);
        this.isFollowingMe.set(success.user.isFollowingMe);

        console.log('::SUCCESS::', success);
      },

      error: (error) => {
        console.log('::ERROR::', error);
      },
    });
  }

  public followUser(): void {
    const userId = this.userId();

    if (!userId) {
      console.error('User ID not found in route!');
      return;
    }

    this.userService.followUserRequest(userId).subscribe({
      next: (success) => {
        this.getUserById(userId);
        this.matBar.open(success.message, 'Close', { duration: 3000 });
        console.log('::SUCCESS::', success);
      },

      error: (error) => {
        this.matBar.open(error.error.message, 'Close', { duration: 3000 });
        console.log('::ERROR::', error);
      },
    });
  }

  public openFollowDialog(
    type: 'followers' | 'following',
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    const userId = this.userId();

    if (!userId) {
      console.error('User ID not found in route!');
      return;
    }

    this.dialog.open(FollowDialog, {
      width: '440px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        userId: userId,
        type: type,
      },
    });
  }
}
