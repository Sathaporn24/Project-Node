import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message = '';

      if (err.status === 400) {
        if (router.url.startsWith('/account/register')) {
          message = getErrorMessage(err);
        }
        else if (router.url.startsWith('/account/resetpassword')) {
          message = getErrorMessage(err);
        }
        else {
          message = err.error ? err.error : err.message;
        }
      }
      else if (err.status === 401) {
        if (router.url.startsWith('/account/login')) {
          message = getErrorMessage(err);
        }
        else if (router.url.startsWith('/home')) {
          message = getErrorMessage(err);
        }
        else {
          message = err.error ? err.error : err.message;
          router.navigate(['/account/login'], { queryParams: { returnUrl: router.url } });
        }
      }

      return throwError(() => Error(message));
    })
  );
};

export const getErrorMessage = (err: HttpErrorResponse) => {
  let message = '';
  const errors = Object.values(err.error.errors);
  message += '<ul>';
  errors.map((e) => {
    message += '<li>' + e + '</li>';
  });
  message += '</ul>';
  return message;
}
