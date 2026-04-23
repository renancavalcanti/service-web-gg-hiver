import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FeedComponent } from './components/feed/feed.component';
import { CapsuleCreateComponent } from './components/capsule-create/capsule-create.component';
import { CapsuleEditComponent } from './components/capsule-edit/capsule-edit.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/feed', pathMatch: 'full'},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'feed', component: FeedComponent, canActivate: [authGuard]},
  {path: 'capsules/create', component: CapsuleCreateComponent, canActivate: [authGuard]},
  {path: 'capsules/edit/:id', component: CapsuleEditComponent, canActivate: [authGuard]}
];

