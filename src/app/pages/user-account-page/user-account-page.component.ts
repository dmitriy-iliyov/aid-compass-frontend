import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../data/interfaces/User.interface';
import { UserAppointmentPrivateDto} from '../../data/interfaces/UserAppointmentPrivate.dto';
import {AppointmentService} from '../../data/services/appointment.service';
import {UserProfileCardInfoComponent} from '../../components/del-user-profile-card-info/user-profile-card-info.component';
import {UserAppointmentCardComponent} from '../../components/user-appointment-card/user-appointment-card.component';
import {UserService} from '../../data/services/user.service';
import {getError, getPrimaryContact} from '../../modules/utils';
import {PagesComponent} from '../../components/pages/pages.component';


@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    UserProfileCardInfoComponent,
    UserAppointmentCardComponent,
    PagesComponent,
  ],
  templateUrl: './user-account-page.component.html',
  styleUrl: './user-account-page.component.scss'
})
export class UserAccountPageComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private appointmentService: AppointmentService
  ) {}

  protected readonly getPrimaryContact = getPrimaryContact;

  user: User | null = null;
  appointments: UserAppointmentPrivateDto[] = [];
  pageCount: number = 0;
  userId: string = '';

  isLoadingAppointment: boolean = true;
  isLoading: string = 'Завантаження ...';
  isError: string = '';
  ngOnInit() {
    this.userService.get().subscribe
    ({
      next:(res)=>{
        if (res && 'customer_profile' in res) {
          this.user = res;
          console.log('user'+this.user)
          this.userId = res.customer_profile.id;
          this.isLoading = '';
          this.getAppointments()
        }
      },
      error:(err)=>{
        this.isLoading = getError('Помилка при отриманні профілю користувача:',err)
        console.error('Помилка при отриманні профілю користувача:', err);
      }});


  }
  selectedFilter: string = 'scheduled';
  setFilter(filter: string) {
    if (this.selectedFilter === filter) return;
    this.selectedFilter = filter;
    this.currentPage = 0;
    this.getAppointments();
  }
  getAppointments(){
    // this.appointmentService.getCustomerAppointments(this.userId).subscribe(appointments => {
    //   this.appointments = appointments;
    //   console.log('appointments'+this.appointments)
    //   this.isLoading = false;
    // });
    this.appointmentService.getCustomerAppointmentsFilter(
      (this.selectedFilter === 'scheduled' || this.selectedFilter === 'all'),
      (this.selectedFilter === 'canceled' || this.selectedFilter === 'all'),
      (this.selectedFilter === 'complete' || this.selectedFilter === 'all'), this.currentPage ).subscribe
    ({
      next:(page)=>{
        this.appointments = page.data;
        this.pageCount = page.total_page
        console.log(this.appointments);
        this.isLoadingAppointment = false;
      },
      error:(err)=>{
        this.isError = getError('Помилка при отриманні записів користувача:',err)
        console.error('Помилка при отриманні записів користувача:', err);
      }});
  }
  goToEdit(id: string) {
    this.router.navigate(['/user-edit'], {
      queryParams: { id }
    });
  }

  removeAppointment(id: number) {
    this.appointments = this.appointments.filter(app => app.appointment.id !== id);
  }

  currentPage:number=0;
  onPageClick($event: number){
    if (this.currentPage == $event) return;
    this.currentPage = $event;
    this.getAppointments();
  }

}

