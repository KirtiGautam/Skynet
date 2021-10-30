import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  throwError as observableThrowError,
} from 'rxjs';

import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private snackbar: MatSnackBar
  ) {}

  // Having any here is ok, since this is used on all requests
  addToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.authService.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          'x-auth-token': this.storageService.get('access_token'),
          'refresh-token': this.storageService.get('refresh_token'),
        },
      });
    }
    return request;
  }

  // Having any here is ok, since this is used on all requests
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const that = this;
    request = that.addToken(request);
    return next.handle(request).pipe(
      map((event) => {
        if (event instanceof HttpResponse && event.status === 201) {
          throw new HttpErrorResponse({
            error: event.body,
            headers: event.headers,
            status: 201,
            statusText: 'Refresh Token',
            url: event.url ? event.url : '',
          });
        }
        return event;
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          that.logoutUser();
        }
        if (error instanceof HttpErrorResponse && error.status === 201) {
          that.authService.store(error.error);
          request = that.addToken(request);
          return next.handle(request);
        }
        return observableThrowError(error);
      })
    );
  }

  logoutUser() {
    this.authService.logout();
    this.snackbar.open('Session expired, please login again');
    this.router.navigate(['/auth/login']);
  }
}
