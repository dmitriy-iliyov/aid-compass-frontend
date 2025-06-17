import { Routes } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {DoctorsPageComponent} from './pages/doctors-page/doctors-page.component';
import {DoctorAppointmentPublicPageComponent} from './pages/doctor-appointment-public-page/doctor-appointment-public-page.component';
import {VolunteerAccountPrivatePageComponent} from './pages/volunteer-account-private-page/volunteer-account-private-page.component';
import {VolunteerEditPageComponent} from './pages/volunteer-edit-page/volunteer-edit-page.component';
import {UserEditPageComponent} from './pages/user-edit-page/user-edit-page.component';
import {JuristsPageComponent} from './pages/jurists-page/jurists-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {RegistrationPageComponent} from './pages/registration-page/registration-page.component';
import {JuristAppointmentPublicPageComponent} from './pages/jurist-appointment-public-page/jurist-appointment-public-page.component';
import {UserAccountPageComponent} from './pages/user-account-page/user-account-page.component';
import {RoleSelectionPageComponent} from './pages/role-selection-page/role-selection-page.component';
import {RecoveryPasswordPageComponent} from './pages/recovery-password-page/recovery-password-page.component';
import {RoleGuard} from './data/services/roleGuard';
import {NoAuthGuard} from './data/services/NoAuthGuard';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {AdminPageComponent} from './pages/admin-page/admin-page.component';
import {
  DoctorProfilePublicPageComponent
} from './pages/doctor-profile-public-page/doctor-profile-public-page.component';
import {
  JuristProfilePublicPageComponent
} from './pages/jurist-profile-public-page/jurist-profile-public-page.component';

export const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full' },
  {path: 'doctors', component: DoctorsPageComponent},
  {path: 'jurists', component: JuristsPageComponent},

  {
    path: 'registration', component: RegistrationPageComponent,
    canActivate: [NoAuthGuard]
  },
  // {
  //   path: 'confirmations', component: ConfirmEmailComponent,
  //   canActivate: [NoAuthGuard]
  // },
  {
    path: 'login', component: LoginPageComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'recovery-password', component: RecoveryPasswordPageComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'role-selection', component: RoleSelectionPageComponent,
    canActivate: [RoleGuard], data: { roles: ['USER'] }
  },
  { path: 'doctor-appointment', component: DoctorAppointmentPublicPageComponent,
    canActivate: [RoleGuard], data: { roles: ['CUSTOMER'] }
  },
  {
    path: 'jurist-appointment', component: JuristAppointmentPublicPageComponent,
    canActivate: [RoleGuard], data: { roles: ['CUSTOMER'] }
  },
  { path: 'doctor-profile', component: DoctorProfilePublicPageComponent,
    // canActivate: [RoleGuard], data: { roles: ['CUSTOMER','DOCTOR', 'JURIST', 'ADMIN']}
  },
  {
    path: 'jurist-profile', component: JuristProfilePublicPageComponent,
    // canActivate: [RoleGuard], data: { roles: ['CUSTOMER','DOCTOR', 'JURIST', 'ADMIN'] }
  },
  {
    path: 'volunteer-account',
    component: VolunteerAccountPrivatePageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['DOCTOR', 'JURIST'] }
  },
  {
    path: 'volunteer-edit',
    component: VolunteerEditPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['DOCTOR', 'JURIST', 'USER'] }
  },
  {
    path: 'user-account',
    component: UserAccountPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['CUSTOMER'] }
  },
  {
    path: 'user-edit',
    component: UserEditPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['CUSTOMER', 'USER'] }
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: '**', component: NotFoundPageComponent
  }
];


