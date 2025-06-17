import { Component } from '@angular/core';
import {RouterModule, RouterLink, RouterLinkActive, Router, ActivatedRoute, Route} from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../data/services/role.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {//implements OnDestroy {
  constructor(
    public roleService: RoleService,
    private router: Router,
  ) {}

  logout() {
    this.roleService.logout();
    this.router.navigate(['/login']);
  }

}
