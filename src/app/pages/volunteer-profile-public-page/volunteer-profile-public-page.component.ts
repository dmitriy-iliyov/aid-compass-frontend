import {Component, Input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DoctorsService} from '../../data/services/doctors.service';
import {YearsUkrPipe} from '../../modules/years-ukr.pipe';
import {JuristsService} from '../../data/services/jurists.service';
import {getPrimaryContact, getPrivateContact} from '../../modules/utils';
import { CommonModule } from '@angular/common';
import {ScheduleComponent} from '../../components/schedule/schedule.component';
import {DoctorProfilePublicDto} from '../../data/interfaces/DoctorProfilePublic.dto';
import {RoleService} from "../../data/services/role.service";


@Component({
  selector: 'app-volunteer-profile-public',
  standalone: true,
  imports: [
    NgForOf,
    YearsUkrPipe,
    CommonModule,
    ScheduleComponent
  ],
  templateUrl: './volunteer-profile-public-page.component.html',
  styleUrl: './volunteer-profile-public-page.component.scss'
})
export class VolunteerProfilePublicPageComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private doctorsService: DoctorsService,
    private juristService: JuristsService,
    private roleService: RoleService,
  ) {}

  protected readonly getPrimaryContact = getPrimaryContact;
  protected readonly getPrivateContact = getPrivateContact;

  @Input() volunteerType!:string;

  isLoading: boolean = true;
  doctorId: string = '';
  ngOnInit() {
    console.log(this.volunteerType);
    this.activatedRoute.queryParams.subscribe
    (params => {
      this.doctorId = params['id'];
      if (this.volunteerType === 'doctor') {
        this.ngOnInitDoctor();
      } else if (this.volunteerType === 'jurist') {
        this.ngOnInitJurist();
      }
    });
  }

  status: string = 'Завантаження ...';
  doctor: DoctorProfilePublicDto = {} as DoctorProfilePublicDto;
  ngOnInitDoctor() {
    this.doctorsService.getPublicProfile(this.doctorId).subscribe
    ({
      next: (response) => {
        this.doctor = response;
        console.log(response);
        this.isLoading = false;

      },
      error: (err) => {
        this.status = 'Помилка при отриманні профілю лікаря:'+ String(err)
        console.error('Помилка при отриманні профілю лікаря:', err);
      }
    });
  }

  ngOnInitJurist() {
    this.juristService.getPublicProfile(this.doctorId).subscribe
    ({
      next: (response) => {
        this.doctor = response;
        console.log(response);
        this.isLoading = false;

      },
      error: (err) => {
        this.status = 'Помилка при отриманні профілю юриста:'+ String(err)
        console.error('Помилка при отриманні профілю юриста:', err);
      }
    });
  }

  getExperience(){
    return Number(this.doctor?.doctor_profile?.doctor?.working_experience)
  }

  showSchedule = true;
  goToSchedule () {
    this.showSchedule = !this.showSchedule;
  }

  isVolunteer() {
    return this.roleService.isVolunteer();
  }



}
