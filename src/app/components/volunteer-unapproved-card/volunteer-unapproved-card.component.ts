import {Component, Input, Output, EventEmitter, ElementRef, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import {DoctorCardPublicDto} from '../../data/interfaces/DoctorCardPublic.dto';
import {RoleService} from '../../data/services/role.service';
import {MatDialog} from '@angular/material/dialog';
import {DoctorsService} from '../../data/services/doctors.service';
import {YearsUkrPipe} from '../../modules/years-ukr.pipe';
import {DoctorProfilePrivateAdminDto} from '../../data/interfaces/DoctorProfilePrivateAdmin.dto';

@Component({
  selector: 'app-volunteer-unapproved-card',
  standalone: true,
  imports: [
    CommonModule,
    YearsUkrPipe
  ],
  providers: [DatePipe],
  templateUrl: './volunteer-unapproved-card.component.html',
  styleUrl: './volunteer-unapproved-card.component.scss'
})

export class VolunteerUnapprovedCardComponent {
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private roleService: RoleService,
    private dialog: MatDialog,
    private doctorsService: DoctorsService
  ) {}

  @Input() doctor?: DoctorProfilePrivateAdminDto;
  @Input() volunteerType: string | undefined;
  @Output() approved = new EventEmitter<string>();

  onApproved(doctor?: DoctorProfilePrivateAdminDto) {
    if (doctor) { // @ts-ignore
        this.approved.emit(doctor);
      }
  }
  // onShowProfile(doctorId?: string){
  //   console.log({ id:doctorId });
  //   this.router.navigate([`/${this.volunteerType}-profile`], {
  //     queryParams: { id:doctorId }
  //   });
  // }

  getExperience(){
    return Number(this.doctor?.doctor_profile?.doctor?.working_experience);
  }

}
