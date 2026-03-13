// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // for *ngIf, async pipe
import { AuthService } from '../../service/auth/auth-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user-modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Expose user$ to template
  user$: Observable<User | null>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.user$ = this.authService.user$;
  }

  logout(): void {
    this.authService.logout(); // clears jwt + userSubject + localStorage
    this.toastr.info('See you soon 👋', 'Logged out', { timeOut: 1500 });
    this.router.navigate(['/']);
  }
}