import {Component, EventEmitter, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {AppointmentForDoctorPrivateDto} from '../../data/interfaces/AppointmentForDoctorPrivate.dto';
import {AppointmentService} from '../../data/services/appointment.service';
import {getPrimaryContact} from '../../modules/utils';


@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'

})
export class AppointmentDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public appointment: AppointmentForDoctorPrivateDto,
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    private appointmentService: AppointmentService
  ) {}

  protected readonly getPrimaryContact = getPrimaryContact;

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
