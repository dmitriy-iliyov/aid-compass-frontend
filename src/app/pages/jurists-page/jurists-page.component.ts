import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {DoctorCardPublicDto} from '../../data/interfaces/DoctorCardPublic.dto';
import {InfoService} from '../../data/services/info.service';
import {JuristsService} from '../../data/services/jurists.service';
import {VolunteersPageComponent} from '../../components/volunteers-page/volunteers-page.component';
import {CommonModule} from '@angular/common';
import {getError} from '../../modules/utils';

@Component({
  selector: 'app-jurists-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    VolunteersPageComponent
  ],
  templateUrl: './jurists-page.component.html',
  styleUrl: './jurists-page.component.scss'
})
export class JuristsPageComponent {
  constructor(
    private juristsService: JuristsService,
    private infoService: InfoService
) {}

  pageCount: number = 0;
  currentPage:number=0;
  onPageClick($event: number){
    if (this.currentPage == $event) return;
    this.currentPage = $event;
    if (this.selectedName !== '') {
      this.nameChange();
    } else if (this.selectedSpecialization !== '' && this.selectedSpecialization !== '100') {
      this.getJurists();
    } else {
      this.getJurists();
    }
  }

  volunteerType = 'jurist';
  volunteerTitle= 'Юристи центру';

  doctors: DoctorCardPublicDto[] = [];
  specializationsList: string[] =[];
  typesList: string[]=[];

  isLoading: string = 'Завантаження юристів...';
  isError: string = '';
  ngOnInit() {

    this.infoService.getJuristSpecialisations().subscribe
    ({
      next:(res)=>{
        this.specializationsList = res
        console.log(this.specializationsList)
        this.infoService.getJuristTypes().subscribe
        ({
          next:(res)=>{
            this.typesList = res
            this.typesList.unshift('Всі');
            console.log(this.typesList)
            this.isLoading = '';
            this.getJurists();

          },
          error:(err)=>{
            this.isLoading = 'Помилка при отриманні типів юриста:'+ String(err)
            console.error('Помилка при отриманні типів юриста:', err);
          }
        });
      },
      error:(err)=>{
        this.isLoading = 'Помилка при отриманні спеціалізацій юриста:'+ String(err)
        console.error('Помилка при отриманні спеціалізацій юриста:', err);
      }
    });




  }

  selectedName:string='';
  onNameChange($event: string) {
    this.isError = '';
    this.selectedName = $event;
    this.selectedSpecialization = '';
    this.currentPage = 0;
    this.nameChange()
  }
  nameChange(){
    console.log(this.selectedType==='Всі'?'':this.selectedType);
    this.juristsService.getJuristsByName(this.selectedName, (this.selectedType === 'Всі' ? '' : this.selectedType), this.currentPage).subscribe
    ({
      next:(res)=>{
        this.doctors = res.data;
        this.pageCount = res.total_page;
        console.log(this.doctors[0]?.doctor)
      },
      error:(err)=>{
        this.isError = getError('Помилка при пошуку юристів по імені:',err)
        console.error('Помилка при пошуку юристів по імені:', err);
      }
    });
  }

  selectedSpecialization: string = '';
  onSpecializationChange($event: string) {
    this.isError = '';
    this.selectedName = '';
    this.selectedSpecialization = $event;
    this.currentPage = 0;
    this.getJurists();
  }

  selectedType: string = 'Всі';
  onTypeChange(filter: string) {
    if (this.selectedType === filter) return;
    this.isError = '';
    this.selectedType = filter;
    this.currentPage = 0;
    if (this.selectedName === '') {
      this.getJurists();
    } else {
      this.nameChange();
    }
  }
  getJurists(){
    this.juristsService.getJuristsByFilter((this.selectedType === 'Всі' ? '' : this.selectedType), this.selectedSpecialization, this.currentPage).subscribe
    ({
      next:(res)=>{
        this.doctors = res.data;
        this.pageCount = res.total_page;
        console.log(this.doctors)
      },
      error:(err)=>{
        this.isError = getError('Помилка при пошуку юристів:',err)
        console.error('Помилка при пошуку юристів:', err);
      }
    });

  }


}
