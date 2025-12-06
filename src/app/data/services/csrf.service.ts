import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CsrfService {

    constructor(private http: HttpClient) {}

    loadToken(): Observable<string> {
        return this.http.get<{ token: string }>(`${environment.apiUrl}/csrf`, {withCredentials: true}).pipe(
            map(response => response.token)
        );
    }
}