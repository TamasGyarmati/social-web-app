import { RouterLink } from '@angular/router';
import { env } from '../_env/env';
import { UserGetAll } from '../_models/userGetAll';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-users',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, RouterLink, MatIconButton],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  public users = signal<UserGetAll[]>([]);
  public isLoading = signal<boolean>(true);
  public searchText = signal<string>('');
  public apiUri = env.apiUri;

  public filteredUsers = computed(() => {
    const search = this.searchText().trim().toLowerCase();
    return this.users().filter(
      (user) =>
        user.userName.toLowerCase().includes(search) ||
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search),
    );
  });

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<UserGetAll[]>(env.userGetAllUri).subscribe(
      (success) => {
        console.log('::SUCCESS::', success);
        this.users.set(success);
        console.log(this.users());
        this.isLoading.set(false);
      },
      (error) => {
        console.log('::ERROR::', error);
      },
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  clearSearch(): void {
    this.searchText.set('');
  }
}
