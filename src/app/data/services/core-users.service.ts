import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {CoreUser} from '../interfaces/CoreUser.interface';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CoreUsersService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/users`;
  constructor() {

  }

  createUser(userData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.baseApiUrl, userData, {withCredentials :true});
  }

  get(): Observable<CoreUser> {
    return this.http.get<CoreUser>(`${this.baseApiUrl}/me`, {withCredentials : true});
  }
}
