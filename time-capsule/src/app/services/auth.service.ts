import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:5000/auth"

  constructor(private http: HttpClient) { }

  signup(data: SignupRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }
}
