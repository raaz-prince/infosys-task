import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthService } from '../service/auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();
  const authService = inject(AuthService);
  
  const token = authService.getToken();

  if(token && !jwtHelper.isTokenExpired(token)){
    return true;
  }
  
  localStorage.removeItem('jwt');
  router.navigate(['/login']);
  return false;
};
