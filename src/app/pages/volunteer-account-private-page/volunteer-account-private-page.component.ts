import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {VolunteerAppointmentCardComponent} from '../../components/volunteer-appointment-card/volunteer-appointment-card.component';
import {Router} from '@angular/router';
import {DoctorsService} from '../../data/services/doctors.service';
import {AppointmentForDoctorPrivateDto} from '../../data/interfaces/AppointmentForDoctorPrivate.dto';
import {AppointmentService} from '../../data/services/appointment.service';
import {YearsUkrPipe} from '../../modules/years-ukr.pipe';
import {JuristsService} from '../../data/services/jurists.service';
import {getError, getPrimaryContact, getPrivateContact} from '../../modules/utils';
import {RoleService} from '../../data/services/role.service';
import { CommonModule } from '@angular/common';
import {ScheduleComponent} from '../../components/schedule/schedule.component';
import {DoctorProfilePrivateDto} from '../../data/interfaces/DoctorProfilePrivate.dto';
import {PagesComponent} from '../../components/pages/pages.component';


@Component({
  selector: 'app-volunteer-account-private',
  standalone: true,
  imports: [
    NgForOf,
    VolunteerAppointmentCardComponent,
    YearsUkrPipe,
    CommonModule,
    ScheduleComponent,
    PagesComponent
  ],
  templateUrl: './volunteer-account-private-page.component.html',
  styleUrl: './volunteer-account-private-page.component.scss'
})
export class VolunteerAccountPrivatePageComponent {
  constructor(
    private router: Router,
    private roleService: RoleService,
    private doctorsService: DoctorsService,
    private juristService: JuristsService,
    private appointmentService: AppointmentService
  ) {}

  protected readonly getPrimaryContact = getPrimaryContact;
  protected readonly getPrivateContact = getPrivateContact;

  doctor: DoctorProfilePrivateDto = {} as DoctorProfilePrivateDto;
  appointments: AppointmentForDoctorPrivateDto[] = [];

  getExperience(){
    return Number(this.doctor?.doctor_profile?.doctor?.working_experience);
  }
  ngOnInit() {
    if (this.roleService.isDoctor()) {
      this.ngOnInitDoctor();
    } else if (this.roleService.isJurist()) {
      this.ngOnInitJurist();
    }
  }
  selectedFilter: string = 'scheduled';
  setFilter(filter: string) {
    if (this.selectedFilter === filter) return;
    this.currentPage = 0;

    this.selectedFilter = filter;
    this.getAppointments();
  }

  isError = '';
  getAppointments() {
    this.isError = '';
    console.log((this.selectedFilter === 'all'), (this.selectedFilter === 'scheduled'), (this.selectedFilter === 'canceled'), (this.selectedFilter === 'complete'))
    //this.appointmentService.getDoctorAppointments().subscribe(appointments => {
    this.appointmentService.getDoctorAppointmentsFilter(
      (this.selectedFilter === 'scheduled' || this.selectedFilter === 'all'),
      (this.selectedFilter === 'canceled' || this.selectedFilter === 'all'),
      (this.selectedFilter === 'complete' || this.selectedFilter === 'all'), this.currentPage).subscribe
    ({
      next:(page)=>{
        console.log(page);
        this.appointments = page.data;
        this.pageCount = page.total_page;
        console.log(this.appointments);
        this.isError = '';
      },
      error:(err)=>{
        this.isError = getError('Помилка при отриманні Записів:',err)
        console.error('Помилка при отриманні Записів:', err);
      }});


  }

  isLoading: string = 'Завантаження ...';
  ngOnInitDoctor() {
    this.doctorsService.getPrivatProfile().subscribe
    ({
      next:(res)=>{
        this.doctor = res;
        console.log(this.doctor);
        this.getAppointments();
        this.isLoading = '';
      },
      error:(err)=>{
        this.isLoading = getError('Помилка при отриманні профілю лікаря:',err)
        console.error('Помилка при отриманні профілю лікаря:', err);
      }});

  }

  ngOnInitJurist() {
    this.juristService.getPrivateProfile().subscribe
    ({
      next:(res)=>{
          this.doctor = res;
          console.log(this.doctor);
          this.getAppointments();
        this.isLoading = '';

      },
      error:(err)=>{
        this.isLoading = getError('Помилка при отриманні профілю юриста:',err)
        console.error('Помилка при отриманні профілю юриста:', err);
      }});


  }

  goToEdit(id:any ) {
    this.router.navigate(['/volunteer-edit'], {
      queryParams: { id: id }
    });
  }

  removeAppointment(id: number) {
    this.appointments = this.appointments.filter(app => app.appointment.id !== id);
  }

  closeAppointment(id: number) {
    this.appointments = this.appointments.filter(app => app.appointment.id !== id);
  }

  showSchedule = false;
  goToSchedule () {
    this.showSchedule = !this.showSchedule;
  }

  isIncomplete () {
    return (this.doctor.doctor_profile.doctor.profile_status === 'INCOMPLETE');
  }


  pageCount: number = 0;
  currentPage:number=0;
  onPageClick($event: number){
    if (this.currentPage == $event) return;
    this.currentPage = $event;
    this.getAppointments();
  }




}
