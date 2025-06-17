import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {AppointmentForDoctorPrivateDto} from '../interfaces/AppointmentForDoctorPrivate.dto';
import {UserAppointmentPrivateDto} from '../interfaces/UserAppointmentPrivate.dto';
import {PageDto} from '../interfaces/Page.dto'

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:8443/api/aggregator/appointments';
  basePrivateApiUrl = 'https://localhost:8443/api/v1/appointments'
  constructor() { }

  create(data: any) {
    const body = {
      volunteer_id: data.volunteerId,
      date: data.date,
      start: data.start,
      type: data.type,
      description: data.description,
    }
    console.log(body)
    return this.http.post<AppointmentForDoctorPrivateDto[]>(`${this.basePrivateApiUrl}/me`, body, {withCredentials :true})
  }

  getDoctorAppointments(): Observable<AppointmentForDoctorPrivateDto[]> {
    return this.http.get<AppointmentForDoctorPrivateDto[]>(`${this.baseApiUrl}`, {withCredentials: true})
  }

  getDoctorAppointmentsFilter(scheduled: boolean, canceled: boolean, complete: boolean, page:number): Observable<PageDto<AppointmentForDoctorPrivateDto>> {
    return this.http.get<PageDto<AppointmentForDoctorPrivateDto>>(`${this.baseApiUrl}/filter?scheduled=${scheduled}&canceled=${canceled}&completed=${complete}&page=${page}&size=10`, {withCredentials: true})
  }

  getDoctorAppointment(appointmentId: number): Observable<AppointmentForDoctorPrivateDto> {
    return this.http.get<AppointmentForDoctorPrivateDto>(`${this.baseApiUrl}/me/${appointmentId}`, {withCredentials: true})
  }
  getCustomerAppointmentsFilter(scheduled: boolean, canceled: boolean, complete: boolean, page:number): Observable<PageDto<UserAppointmentPrivateDto>> {
    return this.http.get<PageDto<UserAppointmentPrivateDto>>(`${this.baseApiUrl}/filter?scheduled=${scheduled}&canceled=${canceled}&completed=${complete}&page=${page}&size=10`, {withCredentials: true})
      .pipe(
        map(response => ({
          ...response,
          data: response.data.map(appointment => ({
            ...appointment,
            avatar_url: appointment.avatar_url || '/assets/images/default-user.png'
          }))
        }))
      );
  }
  getCustomerAppointments(customerId: string): Observable<UserAppointmentPrivateDto[]> {
    return this.http.get<UserAppointmentPrivateDto[]>(`${this.baseApiUrl}`, {withCredentials :true})
      .pipe(
        map(appointments =>
          appointments.map(appointment => ({
            ...appointment,
            avatar_url: appointment.avatar_url || '/assets/images/default-user.png'
          }))
        )
      );
  }

  delete(id: number | undefined) {
    return this.http.delete(`${this.basePrivateApiUrl}/me/${id}`, {withCredentials :true, observe: 'response' });
  }
  close(id: number | undefined, reason:string) {
    return this.http.patch(`${this.basePrivateApiUrl}/me/${id}/complete`, {'reason':reason}, {withCredentials :true, observe: 'response' });
  }
  getAppointmentDurationPublic(id:string): Observable<number> {
    return this.http.get<number>(`${this.basePrivateApiUrl}/duration/${id}`, {withCredentials :true});
  }
  getAppointmentDurationPrivate(): Observable<string> {
    return this.http.get<string>(`${this.basePrivateApiUrl}/duration/me`, {withCredentials :true});
  }
  setAppointmentDuration(duration: string) {
    console.log(`${this.basePrivateApiUrl}/duration/me?duration=${duration}`);
    return this.http.put(`${this.basePrivateApiUrl}/duration/me?duration=${duration}`, null, { withCredentials: true });
  }
}
