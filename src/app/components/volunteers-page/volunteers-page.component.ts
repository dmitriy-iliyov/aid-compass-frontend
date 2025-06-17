import {Component, EventEmitter, Input, Output} from '@angular/core';
import {VolunteerProfileCardComponent} from "../volunteer-profile-card/volunteer-profile-card.component";
import {NgIf, NgFor} from '@angular/common';
import {ScheduleComponent} from '../schedule/schedule.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {DoctorCardPublicDto} from '../../data/interfaces/DoctorCardPublic.dto';
import {RoleService} from '../../data/services/role.service';
import {PagesComponent} from '../pages/pages.component';

@Component({
  selector: 'app-volunteers-page',
  standalone: true,
  imports: [
    VolunteerProfileCardComponent,
    NgIf,
    NgFor,
    ScheduleComponent,
    ReactiveFormsModule,
    FormsModule,
    PagesComponent
  ],
  templateUrl: './volunteers-page.component.html',
  styleUrl: './volunteers-page.component.scss'
})
export class VolunteersPageComponent {
  constructor(
    private roleService: RoleService,
  ) {
  }
  @Input() pageCount?:number;
  @Input() currentPage?:number;

  @Output() pageClick = new EventEmitter<number>();
  onPageClick($event: number){
    this.pageClick.emit($event)
  }


  @Input() volunteerType?:string;
  @Input() volunteerTitle?:string;

  @Input() doctors: DoctorCardPublicDto[] = [];
  @Input() specializationsList: string[] =[];




  @Input() typesList: string[] = [];
  @Input() selectedType: string = '';
  @Output() typeChange = new EventEmitter<string>();
  onTypeChange(selectedType: string) {
    //this.selectedName = "";
    this.typeChange.emit(selectedType);
  }

  @Output() nameChange = new EventEmitter<string>();
  selectedName: string = '';
  onNameChange(){
    if (this.selectedName.length == 1) return;
    this.selectedSpecialization = '100'
    this.nameChange.emit(this.selectedName)
  }

  @Output() specializationChange = new EventEmitter<string>();
  selectedSpecialization: string = '';
  onSpecializationChange(){
    this.selectedName = "";
    this.specializationChange.emit((this.selectedSpecialization === '100' ? '' : this.selectedSpecialization));
  }


  showSchedule = false;
  selectedDoctorId: string | null = null;
  onShowSchedule(doctorId: string) {
    if (this.showSchedule && this.selectedDoctorId === doctorId) {
      this.showSchedule = false;
      this.selectedDoctorId = null;
    } else {
      this.showSchedule = true;
      this.selectedDoctorId = doctorId;
    }
  }

  isVolunteer() {
    return this.roleService.isVolunteer();
  }

}

