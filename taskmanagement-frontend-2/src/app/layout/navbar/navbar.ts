import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  logout(): void {
    this.authService.removeToken();
    this.toastr.success('Logged out successfully', 'Success', { timeOut: 1500 });
    this.router.navigate(['/']);
  }
}
