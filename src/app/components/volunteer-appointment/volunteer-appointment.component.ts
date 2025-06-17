import {Component, Input} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {DoctorProfilePublicDto} from '../../data/interfaces/DoctorProfilePublic.dto';
import {AppointmentService} from '../../data/services/appointment.service';
import {DoctorsService} from '../../data/services/doctors.service';
import {JuristsService} from '../../data/services/jurists.service';

@Component({
  selector: 'app-volunteer-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './volunteer-appointment.component.html',
  styleUrl: './volunteer-appointment.component.scss'
})
export class VolunteerAppointmentComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private router: Router,
    private doctorsService: DoctorsService,
    private juristsService: JuristsService
  ) {}

  @Input() volunteerType!:string;
  d?: string;
  t?: string;

  doctorId: string = '';
  doctor: DoctorProfilePublicDto = {} as DoctorProfilePublicDto;
  isLoading = true;
  status = ''
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe
    (params => {
      this.doctorId = params['id'];
      this.d = params['d'];
      this.t = params['t'];

      switch (this.volunteerType) {
      case 'doctor':
        this.doctorsService.getPublicProfile(this.doctorId).subscribe
        ({
          next:(res)=>{
            this.doctor = res;
            console.log(this.doctor);
            this.isLoading = false;
          },
          error:(err)=>{
            this.status = 'Помилка при отриманні даних лікаря:'+ String(err)
            console.error('Помилка при отриманні даних лікаря:', err);
          }});

        break;
      case 'jurist':
        this.juristsService.getPublicProfile(this.doctorId).subscribe
        ({
          next:(res)=>{
            this.doctor = res;
            console.log(this.doctor);
            this.isLoading = false;
          },
          error:(err)=>{
            this.status = 'Помилка при отриманні даних юриста:'+ String(err)
            console.error('Помилка при отриманні даних юриста:', err);
          }});

        break;
    }
    });
  }

  getVolunteerTitle () {
    return (this.volunteerType === 'doctor' ? 'лікар' : 'юрист');
  }
  getExperience(){
    return Number(this.doctor?.doctor_profile?.doctor?.working_experience)
  }
  getDateObj(): Date | null {
    // console.log('t', this.t);
    // console.log('d', this.d);

    if (!this.d || !this.t) return null;
    return new Date(`${this.d}T${this.t}:00`);
  }

  submitted = false;
  formData = {
    appointment: 'OFFLINE',
    description: ''
  };
  errorMessages: { [key: string]: string } = {};
  submitForm(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      console.log('Форма відправлена', this.formData);
      console.log(this.doctor)
      if (!this.doctor || !this.doctor.doctor_profile?.doctor?.id) {
        return;
      }
      const preparedData = {
        volunteerId: this.doctor.doctor_profile.doctor.id,
        date: this.d,
        start: this.t,
        type: this.formData.appointment,
        description: this.formData.description
      }
      this.appointmentService.create(preparedData).subscribe
      ({
        next:(res)=>{
          this.submitted = false;
          form.resetForm({appointment: 'OFFLINE'});
          this.router.navigate(['/user-account'])
        },
        error:(err)=>{
          this.errorMessages = {};
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.errorMessages[e.field] = e.message;
            }
          } else if (err?.status != 200) {
            this.errorMessages['specialization_detail'] = 'Помилка додавання консультаціі: ' + String(err);
          }

          console.error('Помилка при додаванні консультаціі:', err);
        }});

    } else {
      console.log('Форма містить помилки');
    }
  }
}
