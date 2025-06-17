import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InfoService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:8443/api/info/v1';
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
