import { Component } from '@angular/core';
import { AuthService } from '../../service/auth/auth-service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest } from '../../models/auth/login/login-request.model';
import { LoginResponse } from '../../models/auth/login/login-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const request: LoginRequest = {
      email: this.formData.email,
      password: this.formData.password
    };
    console.log(request);

    this.authService.login(request).subscribe({
      next: (res: LoginResponse) => {
        this.toastr.success(
          res.user?.fullName
            ? `Welcome back, ${res.user.fullName}`
            : 'Login Successful',
          'Logged In',
          { timeOut: 2500 }
        );
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        const msg =
                  err?.error?.errorMessage ??
                  err?.message ??
                  'Login failed. Please try again.';
                this.toastr.error(msg);
      }
    })
  }
}
