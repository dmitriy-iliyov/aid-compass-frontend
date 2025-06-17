import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule, NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../data/services/auth.service';
import {RoleService} from '../../data/services/role.service';


@Component({
  selector: 'role-selection-page',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './role-selection-page.component.html',
  styleUrl: './role-selection-page.component.scss'
})
export class RoleSelectionPageComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  formData = {role: 'CUSTOMER'};
  errorMessages: { [key: string]: string } = {};

  submitRoleForm(form: NgForm) {
    this.errorMessages['role']="";

    if (this.formData.role === 'VOLUNTEER') {
      this.errorMessages['role']="Будь ласка, оберіть спеціалізацію волонтера (Лікар або Юрист)";
      console.log('Role:', this.formData.role);
      return
    } else {
      switch (this.formData.role) {
        case "CUSTOMER":
          this.router.navigate(['/user-edit']);
          break;
        default:
          this.router.navigate(['/volunteer-edit'], {
            queryParams: { role: this.formData.role }
          });
      }
    }
  }
}
