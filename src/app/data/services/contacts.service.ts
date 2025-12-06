import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/v1/contacts`;
  constructor() {

  }

  updateAll(contacts: any[]) {
    return this.http.patch(`${this.baseApiUrl}/batch`, { contacts: contacts }, {withCredentials: true})
  }

  create(contact: any) {
    return this.http.post(`${this.baseApiUrl}`, contact, {withCredentials: true})
  }
}
