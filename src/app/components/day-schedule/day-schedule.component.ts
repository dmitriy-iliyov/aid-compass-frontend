import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ScheduleService} from '../../data/services/schedule.service';
import {RoleService} from '../../data/services/role.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../ConfirmDialog/confirm-dialog.component';
import {AppointmentService} from '../../data/services/appointment.service';
import {AppointmentDialogComponent} from '../appointment-dialog/appointment-dialog.component';
import {AppointmentForDoctorPrivateDto} from '../../data/interfaces/AppointmentForDoctorPrivate.dto';
import {AlertDialogComponent} from '../AlertDialog/alert-dialog.component';
import {getError} from '../../modules/utils';


@Component({
  selector: 'app-day-schedule',
  standalone: true,
  imports: [FormsModule, NgFor, DatePipe, NgIf, NgClass],
  providers: [DatePipe],
  templateUrl: './day-schedule.component.html',
  styleUrl: './day-schedule.component.scss'
})
export class DayScheduleComponent {
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private scheduleService: ScheduleService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {
  }

  @Input() doctorId!: string;
  @Input() day!: string;
  @Output() deletedAppointment = new EventEmitter<number>();

  ngOnChanges() {
    console.log(this.isAdmin());
    this.generateSchedule();
  }

  title = 'Оберіть зручний час';
  availableTimes: string[] = [];
  volunteerTimes: { [key: string]: { id: number, status: string } } = {};
  allTimes: string[] = [];
  selectedTm: string | null = null;
  showTm = false;

  isLoading = true;
  status: string = 'Завантаження ...';
  generateSchedule() {
    console.log(this.day)
    this.isLoading = true;

    if (this.isVolunteer()) {
      this.title = 'Ваші години роботи';
      this.scheduleService.getVolunteerTimes(this.day).subscribe
      ({
        next:(data)=>{// @ts-ignore
          this.volunteerTimes = data;
          this.allTimes = Object.keys(this.volunteerTimes);
          this.isLoading = false;
          console.log(this.volunteerTimes);
        },
        error:(err)=>{
          this.status = getError('Помилка при отриманні Вашіх години роботи:',err)
          console.error('Помилка при отриманні Вашіх години роботи:', err);
        }});
    } else {
      if (this.isNoUser() || this.isAdmin()) {
        this.title = 'Часи роботи волонтера';
      }
      this.scheduleService.getAvailableTimes(this.doctorId, this.day).subscribe
      ({
        next:(data)=>{// @ts-ignore
          this.availableTimes = data
          this.isLoading = false;
          console.log(data)

        },
        error:(err)=>{
          this.status = getError('Помилка при отриманні години роботи волонтера:',err)
          console.error('Помилка при отриманні години роботи волонтера'+this.title+':', err);

        }});


    }
  }

  getAppId(tm:string){
    return this.volunteerTimes[tm]['id'];
  }

  isSameTm(t1: string | null, t2: string): boolean {
    if (!t1) return false;
    return t1 === t2;
  }
  isVolunteer() {
    return this.roleService.isVolunteer();
  }
  isAdmin() {
    return this.roleService.isAdmin();
  }
  isCustomer() {
    return this.roleService.isCustomer();
  }

  isAvailable(tm: string): boolean {
    return (String(this.volunteerTimes[tm]['status']) === '1');
  }

  isBusy(tm: string): boolean {
    return (String(this.volunteerTimes[tm]['status']) === '2');
  }
  isNoUser(){
    return this.roleService.isNoUser()
  }
  isUser(){
    return this.roleService.isUser()
  }

  appointment?: AppointmentForDoctorPrivateDto;


  onSelectTimeVolunteer(day: string, time: string, id: number, element: EventTarget | null) {
    if (this.selectedTm && this.isSameTm(this.selectedTm, time)) {
      this.showTm = false;
      this.selectedTm = null;
    } else {
      this.selectedTm = day;
      this.showTm = true;
    }


    if (this.isVolunteer()) {
      if (this.isBusy(time)) {
        this.isLoading = true;



        this.appointmentService.getDoctorAppointment(id).subscribe
        ({
          next:(appointment)=>{
            this.isLoading = false;
            this.appointment = appointment;
            console.log(appointment);
            const dialogRef = this.dialog.open(AppointmentDialogComponent, {
              width: 'auto',
              data: appointment
            });
            dialogRef.afterClosed().subscribe
            (result => {
              if (result === true) {


                const dialogRef2 = this.dialog.open(ConfirmDialogComponent, {
                  width: '400px',
                  panelClass: 'centered-dialog',
                  disableClose: false,
                  data: {
                    title: 'Скасування запису пацієнта',
                    message: `Запис пацієнта буде скасовано!`
                  }
                });
                dialogRef2.afterClosed().subscribe
                (result => {
                  if (result === true) {
                    this.appointmentService.delete(this.appointment?.appointment.id).subscribe
                    ({
                      next: (response) => {
                        this.deletedAppointment.emit(this.appointment?.appointment.id);
                        const htmlElement = element as HTMLElement;
                        if (htmlElement) {
                          htmlElement.classList.remove('busy-tm');
                          this.volunteerTimes[time]['status'] = '0';
                          // @ts-ignore
                          this.volunteerTimes[time]['id'] = null;
                        }
                        console.log(response);
                      },
                      error: (err) => {
                        //alert('Запис видалити не вдалося. Спробуйте пізніше')
                        const dialogRef2 = this.dialog.open(AlertDialogComponent, {
                          width: '400px',
                          panelClass: 'centered-dialog',
                          disableClose: false,
                          data: {
                            title: 'Скасування запису пацієнта:',
                            message:
                              'Не вдалосб скасувати запис',
                          }
                        });
                      }
                    });
                  }
                });



              }
            });
          },
          error:(err)=>{
            alert('Помилка отримання інформаціі про консультацію:'+ String(err));
            console.error('Помилка отримання інформаціі про консультацію:', err);
          }});






      } else if (this.isAvailable(time)) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          panelClass: 'centered-dialog',
          disableClose: false,
          data: {
            title: 'Видалення часу '+time,
            message: `Ви впевнені, що хочете видалити цей час з Вашого розкладу? Клієнти не зможуть записатися до Вас на прийом у цей час!`
          }
        });
        dialogRef.afterClosed().subscribe
        (result => {
          if (result === true) {
            this.scheduleService.deleteTime(this.volunteerTimes[time]['id']).subscribe
            ({
              next: () => {
                const htmlElement = element as HTMLElement;
                if (htmlElement) {
                  htmlElement.classList.remove('available-tm');
                  this.volunteerTimes[time]['status'] = '0';
                  // @ts-ignore
                  this.volunteerTimes[time]['id'] = null;
                }
              },
              error: () => {
                alert('Час видалити не вдалося. Спробуйте пізніше')
              }
            });
          }
          });
      } else {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          panelClass: 'centered-dialog',
          disableClose: false,
          data: {
            title: 'Додавання часу ' + time,
            message: `Час буде додано до Вашого розкладу. Клієнти зможуть записатися до Вас на прийом на цей час.`
          }
        });
        dialogRef.afterClosed().subscribe
        (result => {
          if (result === true) {
            this.scheduleService.setVolunteerTime(day, time).subscribe
            ({
              next: (result:any) => {
                this.volunteerTimes[time]['status'] = '1';
                this.volunteerTimes[time]['id'] = result?.id;
                console.log(result)
                const htmlElement = element as HTMLElement;
                if (htmlElement) {
                  htmlElement.classList.add('available-tm');
                }
              },
              error: () => {
                alert('Час додати не вдалося. Спробуйте пізніше')
              }
            });
          }
        });
      }
    }
    else {
        this.router.navigate(['/doctor-appointment'], {queryParams: {id: this.doctorId, d: day, t: time}});
    }
  }

  onSelectTime(day: string, time: string) {
    if (this.selectedTm && this.isSameTm(this.selectedTm, time)) {
      this.showTm = false;
      this.selectedTm = null;
    } else {
      this.selectedTm = day;
      this.showTm = true;
    }

    this.router.navigate(['/doctor-appointment'], {queryParams: {id: this.doctorId, d: day, t: time}});
  }
  onSelectTimeNoUser() {
    const dialogRef2 = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      panelClass: 'centered-dialog',
      disableClose: false,
      data: {
        title: 'Запис на консультацію до волонтера:',
        message:
          'Запис на консультацію до волонтера можливий лише для зареєстрованих користувачів. Зареєструйтесь, будь ласка!',
      }
    });
  }






}
