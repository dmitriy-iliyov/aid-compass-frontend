import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppointmentForDoctorPrivateDto} from '../../data/interfaces/AppointmentForDoctorPrivate.dto';
import {getPrimaryContact} from '../../modules/utils';
import {AppointmentService} from '../../data/services/appointment.service';
import {NgIf} from '@angular/common';
import {CloseAppointmentDialogComponent} from '../close-appointment-dialog/close-appointment-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../ConfirmDialog/confirm-dialog.component';

@Component({
  selector: 'app-volunteer-appointment-card',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './volunteer-appointment-card.component.html',
  styleUrl: './volunteer-appointment-card.component.scss'
})
export class VolunteerAppointmentCardComponent {
  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,

  ) {}

  protected readonly getPrimaryContact = getPrimaryContact;

  @Input() appointment?: AppointmentForDoctorPrivateDto;
  @Output() deletedAppointment = new EventEmitter<number>();
  @Output() closedAppointment = new EventEmitter<number>();

  deleteAppointment(appointment: AppointmentForDoctorPrivateDto | undefined) {
    if (appointment == null)
      return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'centered-dialog',
      disableClose: false,
      data: {
        title: 'Видалення запісу користувача:',
        message:
          '<p>' + appointment?.customer?.last_name +' '+
          appointment?.customer?.first_name +' ('+
          appointment?.customer?.birthday_date +', '+
          appointment?.customer?.gender +'). </p><p> ' +
          appointment?.appointment?.description +'</p><p>'+
          'Ви впевнені, що хочете скасувати цей запис?</p>',
      }
    });
    dialogRef.afterClosed().subscribe
    (result => {
      if (result === true) {
        this.appointmentService.delete(appointment?.appointment?.id).subscribe
        ({
          next:()=>{
            this.deletedAppointment.emit(appointment?.appointment?.id);
          },
          error:(err)=>{
            alert('Помилка Видалення запісу користувача:'+ String(err));
            console.error('Помилка Видалення запісу користувача:', err);
          }});
      }
    })
  }


  closeAppointment(appointment?: AppointmentForDoctorPrivateDto){
    const dialogRef = this.dialog.open(CloseAppointmentDialogComponent, {
      width: 'auto',
      data: appointment
    });
    dialogRef.afterClosed().subscribe
    (result => {
      if (result === true) {
        this.closedAppointment.emit(appointment?.appointment?.id);
      }
    });
  }

  isCanceled():boolean {
    return (this.appointment?.appointment.status === 'Скасовано');
  }
  isFinished(): boolean{
    return (this.appointment?.appointment.status === 'Завершено');
  }

}
