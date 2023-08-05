import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { LocalStorageService } from './services/local-storage.service';
import { LocalStorageKeys } from './local-storage-keys';
import { Router } from '@angular/router';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const jwtToken = this.localStorageService.get(LocalStorageKeys.JWT_TOKEN_KEY);

    if (jwtToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)
      });
      return this.sendRequest(authReq, next);
    }

    return this.sendRequest(req, next);
  }

  private sendRequest(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleHttpError(error))
    );
  }

  private handleHttpError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if ((error.status === 400 && (this.router.url === '/register' || this.router.url === '/login')) ||
        (error.status === 401 && this.router.url === '/login')) {
      return throwError(() => error);
    }

    if (error.status === 401) {
      this.localStorageService.remove(LocalStorageKeys.JWT_TOKEN_KEY);
      this.router.navigate(['/login']);
    }
    else {
      this.router.navigate(['/error'], { state: { errorCode: error.status }, skipLocationChange: true });
    }

    return EMPTY;
  }
}
