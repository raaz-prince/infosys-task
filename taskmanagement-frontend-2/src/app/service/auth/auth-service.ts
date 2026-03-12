import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable } from 'rxjs';
import { RegisterRequest } from '../../models/auth/register/register-request.model';
import { RegisterResponse } from '../../models/auth/register/register-response.model';
import { LoginRequest } from '../../models/auth/login/login-request.model';
import { LoginResponse } from '../../models/auth/login/login-response.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  URL = 'http://localhost:8080/api/auth';

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.URL}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL}/login`, data).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem('jwt', res.token);
        }
      })
    )
  }

  removeToken(): void {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}
