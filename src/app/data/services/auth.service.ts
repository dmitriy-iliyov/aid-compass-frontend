import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, from, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {RoleService} from './role.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}`;
  constructor(
    private roleService: RoleService,
  ) {}

  recoveryPassword(email: string,) {
    return this.http.post<any>(`${this.baseApiUrl}/password-recovery/request?resource=${email}`, { withCredentials: true });
  }

  setNewPassword (code: string, password: string) {
    console.log([code, password]);
    return this.http.patch(`${this.baseApiUrl}/password-recovery/recover`, {code, password }, { withCredentials: true })
      .pipe(
        tap(() => {
          console.log('Роль успішно завантажена після логіну');
        }),
        catchError(error => {
          console.error('Помилка при логіні або завантаженні ролі:', error);
          return throwError(() => error);
        })
      );
  }




}
