import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  http = inject(HttpClient);
  baseTimetableApiUrl = 'https://localhost:8443/api/v1/timetable';
  baseDaysApiUrl = 'https://localhost:8443/api/v1/days';
  baseIntervalsApiUrl = 'https://localhost:8443/api/v1/intervals';
  constructor() { }

  getAvailableDays(doctorId:string): Observable<String[]> {
    return this.http.get<String[]>(`${this.baseTimetableApiUrl}/${doctorId}/month/dates`)
  }
  getAvailableTimes(doctorId:string, day:string): Observable<String[]> {
    return this.http.get<String[]>(`${this.baseDaysApiUrl}/${doctorId}?date=${day}`)
  }
  getVolunteerDays(): Observable<String[]> {
    return this.http.get<String[]>(`${this.baseTimetableApiUrl}/me/month/dates`, {withCredentials: true})
  }
  getVolunteerTimes(day:string): Observable<String[]> {
    return this.http.get<String[]>(`${this.baseDaysApiUrl}/me?date=${day}`, {withCredentials: true})
  }
  setVolunteerTime(date:string, start:string): Observable<String[]> {
    return this.http.post<String[]>(`${this.baseIntervalsApiUrl}/me?return_body=true`, { start, date }, {withCredentials: true})
  }

  deleteTime(timeId: number): Observable<any> {
    return this.http.delete(`${this.baseIntervalsApiUrl}/me/${timeId}`, {withCredentials: true, observe: 'response' });
  }

}
