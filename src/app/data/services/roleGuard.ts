import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleService } from './role.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles: string[] = route.data['roles'];
    return this.roleService.role$.pipe(
      map(role => {
        if (allowedRoles.includes(role)) {
          return true;
        } else {
          this.router.navigate(['/no-access']);
          return false;
        }
      })
    );
  }
}
