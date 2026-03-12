import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../service/auth/auth-service";
import { Router } from "@angular/router";


const SKIP_AUTH_URLS = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh'
];

function shouldSkip(req: HttpRequest<unknown>): boolean {
    return SKIP_AUTH_URLS.some((u) => req.url.includes(u));
}

export const jwtInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    let authReq = req;

    const token = authService.getToken();
    if(token && !shouldSkip(req)){
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((err) => {

            if (err.status === 401 || err.status === 403) {
                authService.removeToken();
                router.navigate(['/login']);
            }
            return throwError(() => err);

        })
    )
}