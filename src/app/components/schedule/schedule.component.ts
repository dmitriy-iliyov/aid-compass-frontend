import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DayScheduleComponent} from '../day-schedule/day-schedule.component';
import { FormsModule } from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ScheduleService} from '../../data/services/schedule.service';
import {RoleService} from '../../data/services/role.service';
import {getError} from '../../modules/utils';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, DayScheduleComponent,FormsModule,DatePipe],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  constructor(
    private scheduleService: ScheduleService,
    private roleService: RoleService,
) {}

  @Input() doctorId!: string;
  @Input() volunteerType!: string;
  @Output() deletedAppointment = new EventEmitter<number>();
  removeAppointment(id: number){
    this.deletedAppointment.emit(id);
  }


  ngOnChanges() {
    this.generateSchedule();
  }
  today: Date = new Date();
  selectedDay: Date | null = null;
  showDaySchedule = false;

  onSelectDay(day: Date): void {
    console.log(day);
    if (this.selectedDay && this.isSameDate(this.selectedDay, day)) {
      this.showDaySchedule = false;
      this.selectedDay = null;
    } else if (this.isFuture(day) && (this.isAvailable(day) || this.isBusy(day) || this.isVolunteer())) {
      this.selectedDay = day;
      this.showDaySchedule = true;
    }
    console.log(this.selectedDay);
  }

  isSameDate(d1: Date | null, d2: Date): boolean {
    if (!d1) return false;
    return d1.toDateString() === d2.toDateString();
  }

  isDayInWeek(week: Date[], day: Date | null): boolean {
    if (!day) return false;
    return week.some(wd => wd.toDateString() === day.toDateString());
  }


  availableDays: string[] = [];
  schedule: Date[][] = [];

  volunteerDays : {[key:string]:string} = {};
  isLoading = true;
  status: string = 'Завантаження розкладу...';
  generateSchedule() {
    this.isLoading = true;
    if (this.roleService.isVolunteer()) {
      this.scheduleService.getVolunteerDays().subscribe
      ({
        next:(data)=>{ // @ts-ignore
          this.volunteerDays = data;
          this.availableDays = Object.keys(this.volunteerDays);
          this.isLoading = false;
          console.log(this.volunteerDays)
        },
        error:(err)=>{
          this.status = getError('Помилка при отриманні дат:',err)
          console.error('Помилка при отриманні дат:', err);
        }});


    } else {
      this.scheduleService.getAvailableDays(this.doctorId).subscribe
      ({
        next:(data)=>{ // @ts-ignore
          this.availableDays = data
          this.isLoading = false;
        },
        error:(err)=>{
          this.status = getError('Помилка при отриманні вільних дат:', err)
          console.error('Помилка при отриманні вільних дат:', err);
        }});


    }

    const startDate = this.getMonday();
    startDate.setHours(0, 0, 0, 0);
    const schedule: Date[][] = [];

    for (let week = 0; week < 6; week++) {
      const weekRow: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + week * 7 + day);
        weekRow.push(date);
      }
      schedule.push(weekRow);
    }
    this.schedule = schedule;
    console.log(this.schedule )

    // for (const key in schedule) {
    //   for (const k in schedule[key]) {
    //     if (this.isFuture(schedule[key][k])) {
    //       console.log(schedule[key][k])
    //     }
    //   }
    // }
  }

  getMonday(date: Date = new Date()): Date {
    const day = date.getDay(); // 0 (вс) – 6 (сб)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  isAvailable(day: Date): boolean {
    const formatted = this.formatDate(day);
    return ((!this.isVolunteer() && this.availableDays.includes(formatted)) || (this.isVolunteer() && this.volunteerDays[formatted] == '1'));
  }

  isBusy(day: Date): boolean {
    const formatted = this.formatDate(day);
    return (this.isVolunteer() && this.availableDays.includes(formatted) && this.volunteerDays[formatted] == '2');
  }
  isFuture(date: Date) {
    return (new Date(date) > this.today);
  }
  isVolunteer() {
    return this.roleService.isVolunteer();
  }
  formatDate(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // месяц от 0
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}
