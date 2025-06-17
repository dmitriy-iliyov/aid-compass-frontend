import {Component} from '@angular/core';
import {VolunteerAppointmentComponent} from '../../components/volunteer-appointment/volunteer-appointment.component';

@Component({
  selector: 'app-doctor-appointment-page',
  standalone: true,
  imports: [
    VolunteerAppointmentComponent,
  ],
  templateUrl: './doctor-appointment-public-page.component.html',
  styleUrl: './doctor-appointment-public-page.component.scss'
})

export class DoctorAppointmentPublicPageComponent {
  constructor(
) {}
  volunteerType = 'doctor';
}

