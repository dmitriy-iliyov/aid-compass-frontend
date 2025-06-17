import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RoleService } from './role.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.roleService.role$.pipe(
      take(1),
      map(role => {
        if (role === 'NOUSER') {
          // корістувач не авторизован - пускаємо
          return true;
        } else {
          // корістувач авторизован - не пускаємо
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
