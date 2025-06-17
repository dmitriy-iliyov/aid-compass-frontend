// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import {AppointmentService} from './appointment.service';
// import {DoctorAppointment} from '../interfaces/DoctorAppointment.interface';
//
// @Injectable({ providedIn: 'root' })
// export class AppointmentFService {
//
//   private appointmentsSubject = new BehaviorSubject<DoctorAppointment[]>([]);
//   public appointments$: Observable<DoctorAppointment[]> = this.appointmentsSubject.asObservable();
//
//   constructor(
//     private appointmentService: AppointmentService
//   ) {}
//
//   deleteAppointment(id: number) {
//     this.appointmentService.delete(id).subscribe({
//       next: (response) => {console.log(response);},
//       error: (err) => {console.log('Запис видалити не вдалося. Спробуйте пізніше')}
//     });
//     // Для примера — сразу обновим локальный список
//     const current = this.appointmentsSubject.value;
//     this.appointmentsSubject.next(current.filter(a => a.id !== id));
//   }
//   getAppointment(id: number){
//     this.appointmentService.getDoctorAppointment(id).subscribe({
//       next: (response) => {console.log(response);},
//       error: (err) => {console.log('Запис видалити не вдалося. Спробуйте пізніше')}
//     })
//   }
//
//
// }
