import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = "";
  password = "";
  error = "";

  constructor(private authService: AuthService, private router: Router){}

  onSubmit(): void {
    this.authService.login({email: this.email, password: this.password}).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(['/feed'])
      },
      error: (err) => {
        this.error = err.error.message;
      }
    });
  }

}
