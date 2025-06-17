import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {DoctorsService} from '../../data/services/doctors.service';
import {DoctorCardPublicDto} from '../../data/interfaces/DoctorCardPublic.dto';
import {InfoService} from '../../data/services/info.service';
import {VolunteersPageComponent} from '../../components/volunteers-page/volunteers-page.component';
import { ActivatedRoute } from '@angular/router';
import {RoleService} from '../../data/services/role.service';
import {CommonModule} from '@angular/common';
import {getError} from '../../modules/utils';

@Component({
  selector: 'app-doctors-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    VolunteersPageComponent
  ],
  templateUrl: './doctors-page.component.html',
  styleUrl: './doctors-page.component.scss'
})
export class DoctorsPageComponent {
  constructor (
    private doctorsService: DoctorsService,
    private infoService: InfoService,
    private route: ActivatedRoute,
    private roleService: RoleService,
) {}

  pageCount: number = 0;
  currentPage:number=0;
  onPageClick($event: number){
    if (this.currentPage == $event) return;
    this.currentPage = $event;
    if (this.selectedName !== '') {
      this.nameChange();
    } else if (this.selectedSpecialization !== '' && this.selectedSpecialization !== '100') {
      this.specializationChange();
    } else {
      this.getDoctors();
    }
  }
  volunteerType = 'doctor';
  volunteerTitle='Лікарі центру';

  doctors: DoctorCardPublicDto[] = [];
  specializationsList: string[] =[];


  isLoading: string = 'Завантаження лікарів...';
  isError: string = '';
  ngOnInit(){
    console.log(  this.roleService.getRole());
    this.infoService.getDoctorSpecialisations().subscribe
    ({
      next:(res)=>{
        this.specializationsList = res
        console.log(this.specializationsList)
        this.isLoading = '';
        this.getDoctors();
      },
      error:(err)=>{
        this.isLoading = 'Помилка при отриманні спеціалізацій лікарів:'+ String(err)
        console.error('Помилка при отриманні спеціалізацій лікарів:', err);
      }});
  }

  getDoctors(){
    this.doctorsService.getDoctors(this.currentPage).subscribe
    ({
      next:(res)=>{
        this.doctors = res.data;
        this.pageCount = res.total_page;
        console.log(this.doctors)
      },
      error:(err)=>{
        this.isLoading = 'Помилка при отриманні перчню лікарів:'+ String(err)
        console.error('Помилка при отриманні перчню лікарів:', err);
      }});
  }
  selectedName:string='';
  onNameChange($event: string) {
    this.isError = '';
    this.selectedName = $event;
    this.selectedSpecialization = '';
    this.currentPage = 0;

    this.nameChange()
  }
  nameChange() {
    this.doctorsService.getDoctorsByName(this.selectedName, this.currentPage).subscribe
    ({
      next:(res)=>{
        this.doctors = res.data;
        this.pageCount = res.total_page;
        console.log(this.doctors[0]?.doctor)
      },
      error:(err)=>{
        this.isError = getError('Помилка при отриманні перчню лікарів по імені:', err)
        console.error('Помилка при отриманні перчню лікарів  по імені:', err);
      }});
  }

  selectedSpecialization: string = '';
  onSpecializationChange($event: string) {
    this.isError = '';
    this.selectedName = '';
    this.selectedSpecialization = $event;
    this.currentPage = 0;
    this.specializationChange();
  }
  specializationChange() {
    this.doctorsService.getDoctorsBySpecialization(this.selectedSpecialization,this.currentPage).subscribe
    ({
      next:(res)=>{
        this.doctors = res.data;
        this.pageCount = res.total_page;
        console.log(this.doctors)
      },
      error:(err)=>{
        this.isError = getError('Помилка при отриманні перчню лікарів по спеціалізаціі:',err)
        console.error('Помилка при отриманні перчню лікарів  по спеціалізаціі:', err);
      }});

  }

}
