import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';
import { RegisterRequest } from '../../models/auth/register/register-request.model';
import { RegisterResponse } from '../../models/auth/register/register-response.model';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { Strength, StrengthLabel } from '../../models/password-strength.type';



@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  private static readonly SCORE_TO_LABEL: readonly StrengthLabel[] = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

  strength: Strength = {
    score: 0,          // 0..4
    label: 'Weak'
  };


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }


  updateStrength(pw: string) {
    const lengthOK = pw.length >= 8;
    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);

    let score = 0 as 0 | 1 | 2 | 3 | 4;

    if (lengthOK) score++;
    if (hasLower && hasUpper) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    // clamp 0..4
    const clamped  = Math.max(0, Math.min(4, score)) as 0 | 1 | 2 | 3 | 4;

    const label = Register.SCORE_TO_LABEL[clamped];

    this.strength = { score: clamped, label };
  }


  get isStrongEnough(): boolean {
    return this.strength.score >= 3;
  }



  onSubmit(form: NgForm) {
    if (form.invalid)
      return;

    if (this.formData.password !== this.formData.confirmPassword) {
      this.toastr.error('Passwords don not match!', 'Error', { timeOut: 3000 })
      return;
    }

    const request: RegisterRequest = {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password
    }

    this.authService.register(request).subscribe({
      next: (res: RegisterResponse) => {
        console.log(res.message);
        this.toastr.success(res?.message ?? 'Registration Successful', 'Success', {timeOut: 3000});
        this.router.navigate(['/login']);
      },
      error: err => {
        const msg =
          err?.error?.errorMessage ??
          err?.message ??
          'Registration failed. Please try again.';
        this.toastr.error(msg);
      }
    })
    console.log(request);
  }
}
