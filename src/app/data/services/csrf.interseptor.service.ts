import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpClient
} from '@angular/common/http';
import {Observable, of, switchMap, tap} from 'rxjs';
import {map} from "rxjs/operators";
import {CsrfService} from "./csrf.service";


@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

    constructor(private csrfService: CsrfService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(req.method)) {
            return next.handle(req);
        }

        if (req.url.endsWith('/csrf') || req.url.includes("/login") || req.url.includes("/api/v1/contact") ) {
            return next.handle(req);
        }

        console.log('[CsrfInterceptor] Intercepted:', req.url);

        return this.csrfService.loadToken().pipe(
            switchMap(fetchedToken => {
                const cloned = req.clone({
                    setHeaders: {
                        'X-XSRF-TOKEN': fetchedToken
                    },
                    withCredentials: true
                });
                return next.handle(cloned);
            })
        );
    }
}


