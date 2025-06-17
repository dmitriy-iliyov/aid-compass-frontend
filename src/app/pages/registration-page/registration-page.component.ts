import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CoreUsersService} from '../../data/services/core-users.service';
import {NgForOf, NgIf} from '@angular/common';
import {hasCookie} from '../../modules/utils';
import {Router} from '@angular/router';
import {RoleService} from '../../data/services/role.service';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule, NgForOf],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private coreUserService: CoreUsersService,
    private roleService: RoleService,
  ) {

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });

    if (hasCookie('needEmailConfirmation')) {
      this.registerFormSubmittedSuccess = true;
    }

  }

  registerForm: FormGroup;
  codeForm: FormGroup;

  confirmationMessage: string = '';
  registerFormSubmitted:boolean = false;
  registerFormSubmittedSuccess:boolean = false;
  errorMessages: { [key: string]: string } = {};
  codeFormSubmitted:boolean = false;

  userEmail: string = '';

  onRegisterFormSubmit(): void {
    this.registerFormSubmitted = true;
    this.registerFormSubmittedSuccess = false;
    if (this.registerForm.valid) {
      this.userEmail = this.registerForm.value.email;
      this.coreUserService.createUser(this.registerForm.value).subscribe
      ({
        next: (response) => {
          this.registerFormSubmittedSuccess = true;
          this.confirmationMessage = response.message;
          console.log('Користувач створений', response);
          this.errorMessages = {};
          document.cookie = "needEmailConfirmation=true; path=/; max-age=86400; SameSite=Strict";
        },
        error: (err) => {
          console.log(err)
          this.errorMessages = {};
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.errorMessages[e.field] = e.message;
            }
          } else if (err?.status != 200) {
            this.errorMessages['email'] = 'Помилка реєстраціі: ' + err?.status;
          }
        }
      });
    }
  }

  onCodeFormSubmit(): void {
    this.codeFormSubmitted = true
    if (this.codeForm.valid) {
      this.roleService.emailConfirmation(this.codeForm.value.code).subscribe
      ({
        next: (response) => {
          document.cookie = "needEmailConfirmation=true; path=/; max-age=0; SameSite=Strict";
          this.router.navigate(['/login']);
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

  newCodeRequest (): void {
    this.errorMessages = {};
    this.codeForm.get('code')?.setValue('');
    this.roleService.newCodeRequest(this.userEmail).subscribe
    ({
      next: (response) => {
        this.registerFormSubmittedSuccess = true;
        console.log('Новый код видправлено', response);
        this.errorMessages = {};
        if (response && response.message) {
          this.confirmationMessage = response.message;
          console.log(response.message);
        } else {
          this.confirmationMessage = 'Відповідь порожня';
          console.log('Відповідь порожня або без message');
        }
      },
      error: (err) => {
        console.log(err)
        this.errorMessages = {};
        if (err.error?.properties?.errors) {
          for (const e of err.error.properties.errors) {
            this.errorMessages[e.field] = e.message;
          }
        } else if (err?.status != 200) {
          this.errorMessages['code'] = 'Помилка отрымання коду: ' + err?.status;
        }
      }
    });

  }

}
