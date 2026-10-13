import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { env } from '../_env/env';
import { User as UserModel } from '../_models/user';
import { ActivatedRoute } from '@angular/router';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  public apiUri = env.apiUri;

  ngOnInit(): void {
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
      .get<{ user: UserModel }>(`${env.userGetByIdUri}/${userId}`, { headers: headers })
      .subscribe(
        (success) => {
          console.log('::SUCCESS::', success);
          this.user.set(success.user);
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
      .post(
        env.userFollowByIdUri,
        {},
        {
          params: { id: userId },

          headers: headers,
        },
      )
      .subscribe({
        next: (success) => {
          console.log('::SUCCESS::', success);
        },
        error: (error) => {
          console.log('::ERROR::', error);
        },
      });
  }
}
