import {Component} from '@angular/core';
import {
  VolunteerProfilePublicPageComponent
} from '../volunteer-profile-public-page/volunteer-profile-public-page.component';

@Component({
  selector: 'app-jurist-profile-page',
  standalone: true,
  imports: [
    VolunteerProfilePublicPageComponent,
  ],
  templateUrl: './jurist-profile-public-page.component.html',
  styleUrl: './jurist-profile-public-page.component.scss'
})

export class JuristProfilePublicPageComponent {
  constructor(
) {}
  volunteerType = 'jurist';
}

