import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserAppointmentPrivateDto} from '../../data/interfaces/UserAppointmentPrivate.dto';
import {JsonPipe, NgIf} from '@angular/common';
import {AppointmentService} from '../../data/services/appointment.service';
import {ConfirmDialogComponent} from '../ConfirmDialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-user-appointment-card',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
  ],
  templateUrl: './user-appointment-card.component.html',
  styleUrl: './user-appointment-card.component.scss'
})
export class UserAppointmentCardComponent {
  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,

  ) {}

  @Input() appointment: UserAppointmentPrivateDto | undefined;
  @Output() deleted = new EventEmitter<number>();

  delete(appointment: UserAppointmentPrivateDto | undefined) {
    if (appointment == null)
      return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'centered-dialog',
      disableClose: false,
      data: {
        title: 'Видалення запісу до спеціаліста:',
        message:
          appointment?.volunteer?.last_name +' '+
          appointment?.volunteer?.first_name +' ' +
          appointment?.volunteer?.second_name + ' ('+
          appointment?.volunteer?.specializations +'). ' +
          'Ви впевнені, що хочете скасувати цей запис?',
      }
    });
    dialogRef.afterClosed().subscribe
    (result => {
      if (result === true) {
        this.appointmentService.delete(appointment?.appointment?.id).subscribe
        ({
          next:(res)=>{
            this.deleted.emit(appointment?.appointment?.id);
          },
          error:(err)=>{
            alert('Помилка при видаленні запису:'+ String(err));
            console.error('Помилка при видаленні запису:', err);
          }});


      }
   })
  }

  isCanceled():boolean {
    return (this.appointment?.appointment.status === 'Скасовано');
  }
  isFinished(): boolean{
    return (this.appointment?.appointment.status === 'Завершено');
  }

}
