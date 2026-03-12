import { Routes } from '@angular/router';
import { Register } from './component/register/register';
import { Login } from './component/login/login';
import { Home } from './component/home/home';
import { Dashboard } from './component/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "login", component: Login },
    { path: "register", component: Register },
    { 
        path: "dashboard", 
        component: Dashboard,
        canActivate: [authGuard]
     }
];
