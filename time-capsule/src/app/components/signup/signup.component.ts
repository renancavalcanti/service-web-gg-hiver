import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  name = "";
  email = "";
  password = "";
  error = "";

  constructor(private authService: AuthService, private router: Router){}


  onSubmit(): void {
    this.authService.signup({name: this.name, email: this.email, password: this.password}).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.error = err.error.message;
      }
    });
  }
}
