import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CsrfService {

    constructor(private http: HttpClient) {}

    loadToken(): Observable<string> {
        return this.http.get<{ token: string }>('https://localhost:8443/csrf', {withCredentials: true}).pipe(
            map(response => response.token)
        );
    }
}