import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../data/services/auth.service';
import {Router} from '@angular/router';
import {NgIf} from "@angular/common";
import {RoleService} from '../../data/services/role.service';

@Component({
  selector: 'app-recovery-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './recovery-password-page.component.html',
  styleUrl: './recovery-password-page.component.scss'
})
export class RecoveryPasswordPageComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private roleService: RoleService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/), Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });



  }

  emailForm: FormGroup;
  emailFormSubmitted = false;
  emailFormSubmittedSuccess = false;

  codeForm: FormGroup;
  codeFormSubmitted = false;
  errorMessages: { [key: string]: string } = {};

  userEmail: string = '';
  onEmailFormSubmit(): void {
    this.emailFormSubmitted = true
    if (this.emailForm.valid) {
      this.authService.recoveryPassword(this.emailForm.get('email')?.value).subscribe
      ({
        next: (response) => {
          this.emailFormSubmittedSuccess = true;
          this.userEmail = this.emailForm.get('email')?.value;
        },
        error: (err) => {
          console.error('Помилка відновлення паролю:', err);
          this.errorMessages = {};
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.errorMessages[e.field] = e.message;
            }
          } else if (err?.status != 200) {
            this.errorMessages['email'] = 'Помилка відновлення паролю: ' + err?.status;
          }
        }
      });
    } else {
      console.log('Unexpected');
    }
  }

  onCodeFormSubmit(): void {
    this.codeFormSubmitted = true
    if (this.codeForm.valid) {
      console.log([this.codeForm.get('code')?.value, this.codeForm.get('password')?.value])
      this.authService.setNewPassword(this.codeForm.get('code')?.value, this.codeForm.get('password')?.value).subscribe
      ({
        next: (response) => {
          this.router.navigate(["/login"])
        },
        error: (err) => {
          console.error('Помилка відновлення паролю:', err);
          this.errorMessages = {};
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.errorMessages[e.field] = e.message;
            }
          } else if (err?.status != 200) {
            this.errorMessages['code'] = 'Помилка відновлення паролю: ' + err?.status;
          }
        }
      });
    } else {
      console.log('Unexpected');
    }
  }

  newCodeRequest (): void {
    this.errorMessages = {};
    this.codeForm.get('code')?.setValue('');
    this.roleService.newCodeRequest(this.userEmail).subscribe
    ({
      next: (response) => {
        this.emailFormSubmittedSuccess = true;
        console.log('Користувач створений', response);
        this.errorMessages = {};
        if (response && response.message) {
          //this.confirmationMessage = response.message;
          console.log(response.message);
        } else {
          //this.confirmationMessage = 'Відповідь порожня';
          console.log('Відповідь порожня або без message');
        }
        //document.cookie = "needEmailConfirmation=true; path=/; max-age=315360000; SameSite=Strict";
      },
      error: (err) => {
        console.log(err)
        this.errorMessages = {};
        if (err.error?.properties?.errors) {
          for (const e of err.error.properties.errors) {
            this.errorMessages[e.field] = e.message;
          }
        } else if (err?.status != 200) {
          this.errorMessages['code'] = 'Помилка підтвердження Email: ' + err?.status;
        }
      }
    });

  }


}
