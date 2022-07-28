import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (
          req.url.includes(environment.restApiAddress + '/create-record') ||
          req.url.includes(environment.restApiAddress + '/add-record') ||
          req.url.includes(environment.restApiAddress + '/modify-programme') ||
          req.url.includes(environment.restApiAddress + '/delete-programme') ||
          req.url.includes(environment.restApiAddress + '/modify-course') ||
          req.url.includes(environment.restApiAddress + '/delete-course') ||
          req.url.includes(environment.restApiAddress + '/mark-attendance') ||
          req.url.includes(environment.restApiAddress + '/post-coordinates') ||
          req.url.includes(environment.restApiAddress + '/sessions') ||
          req.url.includes(environment.restApiAddress + '/create-attandance')
        ) {
          const modifiedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`,
              Accept: '*/*',
            },
          });
          return next.handle(modifiedReq);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
