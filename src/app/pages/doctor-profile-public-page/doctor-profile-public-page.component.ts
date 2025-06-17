import {Component} from '@angular/core';
import {
  VolunteerProfilePublicPageComponent
} from '../volunteer-profile-public-page/volunteer-profile-public-page.component';

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [
    VolunteerProfilePublicPageComponent,
  ],
  templateUrl: './doctor-profile-public-page.component.html',
  styleUrl: './doctor-profile-public-page.component.scss'
})

export class DoctorProfilePublicPageComponent {
  constructor(
) {}
  volunteerType = 'doctor';
}

