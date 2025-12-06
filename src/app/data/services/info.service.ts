import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class InfoService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/info/v1`;
  constructor() { }

  getDoctorSpecialisations():Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}/doctors-specialization`)
  }

  getJuristSpecialisations():Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}/jurists-specialization`)
  }
  getJuristTypes():Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}/jurists-type`)
  }

}
