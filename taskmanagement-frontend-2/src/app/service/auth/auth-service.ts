import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, BehaviorSubject } from 'rxjs';
import { RegisterRequest } from '../../models/auth/register/register-request.model';
import { RegisterResponse } from '../../models/auth/register/register-response.model';
import { LoginRequest } from '../../models/auth/login/login-request.model';
import { LoginResponse } from '../../models/auth/login/login-response.model';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user/user-modal';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  URL = 'http://localhost:8080/api/auth';

  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  user$ = this.userSubject.asObservable();

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.URL}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL}/login`, data).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem('jwt', res.token);
        }

        if(res?.user) {
          const u: User = res.user;
          this.saveUserToStorage(u);
          this.userSubject.next(u);
        }
      })
    )
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.userSubject.next(null);
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

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  private loadUserFromStorage(): User | null {
    try{
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

}
