import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isAuthenticated = false;
  userName = '';

  constructor(private readonly router: Router, private readonly authService: AuthService){
    this.authService.currentUser$.subscribe( user => {
      this.isAuthenticated = !!user;
      this.userName = user?.name || '';
    })
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
