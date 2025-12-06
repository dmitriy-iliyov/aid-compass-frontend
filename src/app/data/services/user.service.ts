import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {User} from '../interfaces/User.interface';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/v1/customers`;
  baseAggregatorApiUrl = `${environment.apiUrl}/aggregator/customers`;
  constructor() {

  }

  get(): Observable<any> {
    return this.http.get<User>(`${this.baseAggregatorApiUrl}/me/profile`, {withCredentials :true});
  }

  update(formData: any) {
    const body = {
      last_name: formData.lastName,
      first_name: formData.firstName,
      second_name: formData.secondName,
      birthday_date: formData.birthDate,
      gender: formData.GENDER
    };
    console.log(body)
    return this.http.patch(`${this.baseApiUrl}/me`, body, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  create(formData: any) {
    const body = {
      last_name: formData.lastName,
      first_name: formData.firstName,
      second_name: formData.secondName,
      birthday_date: formData.birthDate,
      gender: formData.GENDER
    };
    console.log(body)
    return this.http.post(`${this.baseApiUrl}`, body, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }
}
