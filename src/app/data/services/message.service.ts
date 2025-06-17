import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:8443/api/confirmations';
  constructor() {

  }

  confirmLinkedEmail(token:string): Observable<any> {
    console.log(token)
    return this.http.post(`${this.baseApiUrl}/linked-email?token=${encodeURIComponent(token)}`, null);
  }
}
