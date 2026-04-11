import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Capsule, CreateCapsuleRequest } from '../models/capsule.model';

@Injectable({
  providedIn: 'root'
})
export class CapsuleService {

  private apiUrl = "http://localhost:5000/capsules";

  constructor(private http: HttpClient) { }

  createCapsule(data: CreateCapsuleRequest): Observable<{message: string, capsule: Capsule}>{
    return this.http.post<{message: string, capsule: Capsule}>(`${this.apiUrl}/`, data);
  }
}
