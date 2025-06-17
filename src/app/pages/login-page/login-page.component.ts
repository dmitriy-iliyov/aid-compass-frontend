import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RoleService} from '../../data/services/role.service';
import {Router} from '@angular/router';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loginForm: FormGroup;
  formSubmitted:boolean = false;
  errorMessages: { [key: string]: string } = {};

  onSubmit(): void {
    this.formSubmitted = true
    if (this.loginForm.valid) {
      this.roleService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).subscribe
      ({
        next: (response) => {
          if (this.roleService.isUser()) {
            console.log("/role-selection")
            this.router.navigate(["/role-selection"])
          } else {
            this.router.navigate(["/"])
          }
        },
        error: (err) => {
          console.error('Помилка логіну:', err);
          this.errorMessages = {};
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.errorMessages[e.field] = e.message;
            }
          } else if (err?.status != 200) {
            this.errorMessages['email'] = 'Помилка логіну: ' + err?.status;
          }
        }
      });
    } else {
      console.log('Unexpected');
    }
  }
}
