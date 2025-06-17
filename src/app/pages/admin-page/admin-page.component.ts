import {Component} from '@angular/core';
import {NgIf, NgFor, DatePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {RoleService} from '../../data/services/role.service';
import {JuristsService} from '../../data/services/jurists.service';
import {InfoService} from '../../data/services/info.service';
import {DoctorsService} from '../../data/services/doctors.service';
import {ScheduleComponent} from '../../components/schedule/schedule.component';
import {getError} from '../../modules/utils';
import {YearsUkrPipe} from '../../modules/years-ukr.pipe';
import {ConfirmDialogComponent} from '../../components/ConfirmDialog/confirm-dialog.component';
import {AlertDialogComponent} from '../../components/AlertDialog/alert-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DoctorProfilePrivateAdminDto} from '../../data/interfaces/DoctorProfilePrivateAdmin.dto';
import {VolunteerUnapprovedCardComponent} from '../../components/volunteer-unapproved-card/volunteer-unapproved-card.component';
import {PagesComponent} from '../../components/pages/pages.component';

export type VolunteerTypeType = 'doctor' | 'jurist';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    FormsModule,
    ScheduleComponent,
    YearsUkrPipe,
    VolunteerUnapprovedCardComponent,
    PagesComponent
  ],
  providers: [DatePipe],

  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {
  constructor(
    private roleService: RoleService,
    private juristsService: JuristsService,
    private infoService: InfoService,
    private doctorsService:DoctorsService,
    private dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,

  ) {
  }

  isLoading: string = 'Завантаження непідтверджених волонтерів';
  ngOnInit() {
    this.getVolunteers();
  }

  volunteerTypes: VolunteerTypeType[] = ['doctor', 'jurist'];
  volunteersTypes:VolunteerTypeType[] = ['doctor','jurist'];
  volunteerType: VolunteerTypeType = 'doctor';
  onTypeChange(type: VolunteerTypeType) {
    if (this.volunteerType === type) return;
    this.volunteerType = type;
    this.currentPage = 0;
    this.getVolunteers();
  }

  doctors: DoctorProfilePrivateAdminDto[] = [] as DoctorProfilePrivateAdminDto[]
  //doctor: DoctorProfilePublicDto = {} as DoctorProfilePublicDto;

  pageCount: number = 0;
  isError = '';
  getVolunteers () {
    this.isError = '';
    switch (this.volunteerType) {
      case "doctor":
        this.doctorsService.getDoctorsUnapproved(this.currentPage).subscribe
        ({
          next:(res)=>{
            this.doctors = res.data;
            this.pageCount = res.total_page;
            console.log(this.doctors)
            this.isLoading = '';
            this.isError = '';
          },
          error:(err)=>{
            this.isError = getError('Помилка при отриманні непідтверджених лікарів:',err)
            console.error('Помилка при отриманні непідтверджених лікарів:', err);
          }});


        // this.infoService.getDoctorSpecialisations().subscribe(val => {
        //   this.specializationsList = val
        //   console.log(this.specializationsList)
        // });
        break;
      case "jurist":
        this.juristsService.getJuristsUnapproved(this.currentPage).subscribe
        ({
          next:(res)=>{
            this.doctors = res.data;
            this.pageCount = res.total_page;
            console.log(this.doctors)
            this.isLoading = '';
            this.isError = '';
          },
          error:(err)=>{
            this.isError = getError('Помилка при отриманні непідтверджених юристів:',err)
            console.error('Помилка при отриманні непідтверджених юристів:', err);
          }});


      //   // this.infoService.getJuristSpecialisations().subscribe(val => {
      //   //   this.isLoading = true;
      //   //   this.specializationsList = val
      //   //   console.log(this.specializationsList)
      //   //   this.isLoading = false;
      //   //
      //   // });
      //   // this.infoService.getJuristTypes().subscribe(val => {
      //   //   this.isLoading = true;
      //   //   this.typesList = val
      //   //   this.typesList.unshift('Всі');
      //   //   console.log(this.typesList)
      //   //   this.isLoading = false;
      //   // });
      //   break;
    }
  }

  selectedName: string = '';
  onNameChange(){
    this.isError = '';
    this.currentPage = 0;
    switch (this.volunteerType) {
      case "doctor":
        this.doctorsService.getUnapprovedDoctorsByName (this.selectedName,this.currentPage).subscribe
        ({
          next:(res)=>{
            this.doctors = res.data;
            this.pageCount = res.total_page;
            console.log(this.doctors)
          },
          error:(err)=>{
            this.isError = getError('Помилка при отриманні непідтверджених юристів по імені:',err)
            console.error('Помилка при отриманні непідтверджених юристів по імені:', err);
          }});

        break;
      case "jurist":
        this.juristsService.getUnapprovedJuristsByName(this.selectedName,this.currentPage).subscribe
        ({
          next:(res)=>{
            this.doctors = res.data;
            this.pageCount = res.total_page
            console.log(this.doctors)
          },
          error:(err)=>{
            this.isError = getError('Помилка при отриманні непідтверджених юристів по імені:',err)
            console.error('Помилка при отриманні непідтверджених юристів по імені:', err);
          }});

        break;
    }
  }


  //doctor: DoctorProfilePublicDto = {} as DoctorProfilePublicDto;
  onApproved(doctor: DoctorProfilePrivateAdminDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'centered-dialog',
      disableClose: false,
      data: {
        title: 'Підтвердженя волонтера:',
        message:
          '<p>' + doctor?.doctor_profile.doctor?.last_name +' '+
          doctor?.doctor_profile.doctor?.first_name + ' ' +
          doctor?.doctor_profile.doctor?.second_name + '('
          +doctor?.doctor_profile.doctor?.specializations + ')</p><p>'+
          doctor?.doctor_profile.doctor?.specialization_detail +'. </p><p> ' +
          'Ви хочете підтвердити цього волонтера?</p>',
      }
    });
    dialogRef.afterClosed().subscribe
    (result => {
      if (result === true) {
        if (this.volunteerType === 'doctor') {
          this.doctorsService.approveDoctor(doctor?.doctor_profile.doctor?.id).subscribe
          ({
            next: (response) => {
              this.doctors = this.doctors.filter(d => d?.doctor_profile.doctor?.id !== doctor?.doctor_profile.doctor?.id);

              const dialogRef2 = this.dialog.open(AlertDialogComponent, {
                width: '400px',
                panelClass: 'centered-dialog',
                disableClose: false,
                data: {
                  title: 'Підтвердженя волонтера:',
                  message:
                    'Волонтера підтверджено!',
                }
              });
            },
            error: (err) => {
              console.error('Помилка додавання контактних даних:', err);
              const dialogRef2 = this.dialog.open(AlertDialogComponent, {
                width: '400px',
                panelClass: 'centered-dialog',
                disableClose: false,
                data: {
                  title: 'Підтвердженя волонтера:',
                  message:
                    'Волонтера підтвердити не вдалось!',
                }
              });
            }
          });
        }

        else if (this.volunteerType === 'jurist') {
          this.juristsService.approveJurist(doctor?.doctor_profile.doctor?.id).subscribe
          ({
            next: (response) => {
              this.doctors = this.doctors.filter(d => d?.doctor_profile.doctor?.id !== doctor?.doctor_profile.doctor?.id);

              const dialogRef2 = this.dialog.open(AlertDialogComponent, {
                width: '400px',
                panelClass: 'centered-dialog',
                disableClose: false,
                data: {
                  title: 'Підтвердженя волонтера:',
                  message:
                    'Волонтера підтверджено!',
                }
              });
            },
            error: (err) => {
              console.error('Помилка додавання контактних даних:', err);
              const dialogRef2 = this.dialog.open(AlertDialogComponent, {
                width: '400px',
                panelClass: 'centered-dialog',
                disableClose: false,
                data: {
                  title: 'Підтвердженя волонтера:',
                  message:
                    'Волонтера підтвердити не вдалось!',
                }
              });
            }
          });
        }

      }
    })
  }

  currentPage:number=0;
  onPageClick($event: number){
    if (this.currentPage == $event) return;
    this.currentPage = $event;
    if (this.selectedName !== '') {
      this.onNameChange();
    } else {
      this.getVolunteers();
    }
  }



}

