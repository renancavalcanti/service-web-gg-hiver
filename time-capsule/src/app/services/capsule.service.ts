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

  getAllCapsules(): Observable<{ capsules: Capsule[] }> {
    return this.http.get<{ capsules: Capsule[] }>(this.apiUrl);
  }

  getReceivedCapsules(): Observable<{ capsules: Capsule[] }> {
    return this.http.get<{ capsules: Capsule[] }>(`${this.apiUrl}/received`);
  }

  getSentCapsules(): Observable<{ capsules: Capsule[] }> {
    return this.http.get<{ capsules: Capsule[] }>(`${this.apiUrl}/sent`);
  }

  openCapsule(id: string): Observable<{ capsule: Capsule }> {
    return this.http.post<{ capsule: Capsule }>(`${this.apiUrl}/${id}/open`, {});
  }

  deleteCapsule(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getCapsuleById(id: string): Observable<{ capsule: Capsule }>{
    return this.http.get<{ capsule: Capsule }>(`${this.apiUrl}/${id}`);
  }

  updateCapsule(id: string, data: CreateCapsuleRequest): Observable<{message: string, capsule: Capsule}>{
    return this.http.patch<{message: string, capsule: Capsule}>(`${this.apiUrl}/${id}`, data);
  }
}
