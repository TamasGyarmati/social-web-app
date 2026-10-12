import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Login } from './login/login';
import { Register } from './register/register';
import { Feed } from './feed/feed';
import { CreatePost } from './create-post/create-post';
import { AuthService } from './_services/auth.service';
import { UserHandling } from './user-handling/user-handling';
import { Users } from './users/users';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'feed', component: Feed },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'create-post', component: CreatePost, canActivate: [AuthService] },
  { path: 'user-handling', component: UserHandling, canActivate: [AuthService] },
  { path: 'users', component: Users, canActivate: [AuthService] },
  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
