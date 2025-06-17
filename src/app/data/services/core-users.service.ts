import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {CoreUser} from '../interfaces/CoreUser.interface';


@Injectable({
  providedIn: 'root'
})
export class CoreUsersService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:8443/api/users';
  constructor() {

  }

  createUser(userData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.baseApiUrl, userData, {withCredentials :true});
  }

  get(): Observable<CoreUser> {
    return this.http.get<CoreUser>(`${this.baseApiUrl}/me`, {withCredentials : true});
  }
}
