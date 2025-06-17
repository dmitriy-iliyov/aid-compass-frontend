import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {User} from '../../data/interfaces/User.interface';
import {getPrimaryContact} from '../../modules/utils';

@Component({
  selector: 'app-user-profile-card-info',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-profile-card-info.component.html',
  styleUrl: './user-profile-card-info.component.scss'
})
export class UserProfileCardInfoComponent {
  constructor(
    private router: Router,
    ) {}

  @Input() user?: User|null;

  protected readonly getPrimaryContact = getPrimaryContact;
}
