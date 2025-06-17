import {Component, EventEmitter, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {AppointmentForDoctorPrivateDto} from '../../data/interfaces/AppointmentForDoctorPrivate.dto';
import {AppointmentService} from '../../data/services/appointment.service';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {AlertDialogComponent} from '../AlertDialog/alert-dialog.component';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './close-appointment-dialog.component.html',
  styleUrl: './close-appointment-dialog.component.scss'

})
export class CloseAppointmentDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public appointment: AppointmentForDoctorPrivateDto,
    private dialogRef: MatDialogRef<CloseAppointmentDialogComponent>,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
  ) {}

  // onConfirm(): void {
  //   this.dialogRef.close(true);
  // }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  formData = {
    reason: ''
  }
  closeErrorMessages: { [key: string]: string } = {};
  submittedCloseForm = false;
  submitCloseForm(form: NgForm) {
    this.submittedCloseForm = true;
    console.log(form.controls)

    if (form.valid) {
      console.log(this.formData);
      this.appointmentService.close(this.appointment.appointment.id, form.controls['reason'].value).subscribe
      ({
        next: (response) => {
          console.log(response);



          const dialogRef2 = this.dialog.open(AlertDialogComponent, {
            width: '400px',
            panelClass: 'centered-dialog',
            disableClose: false,
            data: {
              title: 'Завершення запису пацієнта',
              message: `Запис завершено!`
            }
          });
          dialogRef2.afterClosed().subscribe
          (result => {
            this.dialogRef.close(true);

          })









        },
        error: (err) => {
          console.error('Помилка завершення запису:', err);
          this.closeErrorMessages = {};
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.closeErrorMessages[e.field] = e.message;
            }
          } else if (err?.status != 200) {
            this.closeErrorMessages['reason'] = 'Помилка завершення запису: ' + err?.status;
          }
        }
      });

    }
  }



}
