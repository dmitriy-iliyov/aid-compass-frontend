import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/confirmations`;
  constructor() {

  }

  confirmLinkedEmail(token:string): Observable<any> {
    console.log(token)
    return this.http.post(`${this.baseApiUrl}/linked-email?token=${encodeURIComponent(token)}`, null);
  }
}
