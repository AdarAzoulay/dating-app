import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        console.log(err)
        switch (err.status) {
          case 400:
            if (err.error.errors) {
              const modelStateError = [];
              for (const key in err.error.errors) {
                if (err.error.errors[key]) {
                  modelStateError.push(err.error.errors[key]);
                }
              }

              throw modelStateError.flat();
            } else {
              if(typeof err.error === 'object'){
                this.toastr.error(
                  err.statusText == 'OK' ? 'Bad Request' : err.statusText, err.status);
                throw err;
              }
              else{
                this.toastr.error(err.error,err.status);
                throw err;
              }
            }
            break;
          case 401:
            this.toastr.error(
              err.statusText == 'OK'
                ? err.error || 'Unauthorised'
                : err.statusText,
              err.status
            );
            break;
          case 404:
            this.router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: err.error },
            };
            this.router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            this.toastr.error('Something unexpected went wrong');
            console.log(err);
        }
        throw throwError(err);
      })
    );
  }
}
