import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';

@Injectable()

export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (request && request.body && request.body.results) {
      const col = JSON.parse(JSON.stringify(request.body));
      col.results = []
      request = request.clone({ body: col});
    }

      const accessToken = this.authService.authorizationAccess_Token;
      if (this.authService.isAuthenticated()&&accessToken) {
        request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${accessToken}`) });
      }
      else{

      }

    // return next.handle(request).pipe(
    //   tap(
    //     (event: HttpEvent<any>) => {
    //       if (event instanceof HttpResponse) {
    //         // Request was successful, handle the response
    //       }
    //     },
    //     (error: any) => {
    //       if (error instanceof HttpErrorResponse) {
    //         // Request failed, handle the error
    //         const statusCode = error.status; // Access the status code here
    //       }
    //     }
    //   )
    // );
    return next.handle(request).pipe(catchError((error:any) => {

      if (error.status === 401) {
        this.authService.loginRedirect();
        // window.location.href = this.router.url;
      }
      else if(error.status == 403)
      {
        localStorage.clear();
        this.authService.loginRedirect();
        // window.location.href = this.router.url;
        //redirect to force logout
      }
      return of(error);
    }) as any);

  }

}
