import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { YearsUkrPipe } from '../../modules/years-ukr.pipe';
import {DoctorCardPublicDto} from '../../data/interfaces/DoctorCardPublic.dto';

@Component({
  selector: 'app-volunteer-profile-card-info',
  standalone: true,
  imports: [
    CommonModule,
    YearsUkrPipe,
  ],
  templateUrl: './volunteer-profile-card-info.component.html',
  styleUrl: './volunteer-profile-card-info.component.scss'
})
export class VolunteerProfileCardInfoComponent {
  constructor(
    private router: Router,
  ) {}

  @Input() doctor?: DoctorCardPublicDto;
  experience : number | null = null;
  ngOnInit() {
    this.experience = Number(this.doctor?.doctor?.working_experience);
  }
}






