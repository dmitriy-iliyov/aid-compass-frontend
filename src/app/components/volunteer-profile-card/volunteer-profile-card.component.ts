import {Component, Input, Output, EventEmitter, ElementRef, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import {DoctorCardPublicDto} from '../../data/interfaces/DoctorCardPublic.dto';
import {RoleService} from '../../data/services/role.service';
import {MatDialog} from '@angular/material/dialog';
import {DoctorsService} from '../../data/services/doctors.service';
import {YearsUkrPipe} from '../../modules/years-ukr.pipe';

@Component({
  selector: 'app-volunteer-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    YearsUkrPipe
  ],
  providers: [DatePipe],
  templateUrl: './volunteer-profile-card.component.html',
  styleUrl: './volunteer-profile-card.component.scss'
})

export class VolunteerProfileCardComponent {
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private roleService: RoleService,
    private dialog: MatDialog,
    private doctorsService: DoctorsService
  ) {}

  @Input() doctor?: DoctorCardPublicDto;
  @Input() volunteerType: string | undefined;
  @Output() showSchedule = new EventEmitter<string>();

  onShowSchedule(doctorId?: string) {
    if (doctorId)
      this.showSchedule.emit(doctorId);
  }
  goToAppointment(doctorId?: string, date?: string, time?: string) {
    console.log('========'+this.volunteerType);
    console.log({ id:doctorId, d: date, t: time });
    this.router.navigate([`/${this.volunteerType}-appointment`], {
      queryParams: { id:doctorId, d: date, t: time }
    });
  }
  onShowProfile(doctorId?: string){
    console.log({ id:doctorId });
    this.router.navigate([`/${this.volunteerType}-profile`], {
      queryParams: { id:doctorId }
    });
  }
  formatDateTime(d?: string, t?: string): string | null {
    //console.log(d, t)
    if (!d || !t) return '';
    const date = new Date(`${d}T${t.padStart(5, '0')}:00`);
    return this.datePipe.transform(date, 'EEEE, dd MMMM, HH:mm', undefined, 'uk');
  }
  isVolunteer() {
    return this.roleService.isVolunteer();
  }
  isAdmin() {
    return this.roleService.isAdmin();
  }
  getExperience(){
    return Number(this.doctor?.doctor?.working_experience);
  }
}
