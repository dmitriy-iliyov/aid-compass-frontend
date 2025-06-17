import {Component} from '@angular/core';
import {VolunteerAppointmentComponent} from '../../components/volunteer-appointment/volunteer-appointment.component';

@Component({
  selector: 'app-jurist-appointment-page',
  standalone: true,
  imports: [
    VolunteerAppointmentComponent,
  ],
  templateUrl: './jurist-appointment-public-page.component.html',
  styleUrl: './jurist-appointment-public-page.component.scss'
})

export class JuristAppointmentPublicPageComponent {
  constructor(
) {}
  volunteerType = 'jurist';

}

