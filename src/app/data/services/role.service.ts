import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable, of, switchMap, throwError} from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private baseApiUrl = 'https://localhost:8443/api';

  constructor(private http: HttpClient) {}

  private roleSubject = new BehaviorSubject<'DOCTOR' | 'JURIST' | 'CUSTOMER' | 'USER' | 'NOUSER' | 'ADMIN'>('NOUSER');
  public role$: Observable<'DOCTOR' | 'JURIST' | 'CUSTOMER' | 'USER' | 'NOUSER' |'ADMIN'> = this.roleSubject.asObservable();

  get role(): 'DOCTOR' | 'JURIST' | 'CUSTOMER' | 'USER' | 'NOUSER' | 'ADMIN' {
    return this.roleSubject.value;
  }

  set role(value: 'DOCTOR' | 'JURIST' | 'CUSTOMER' | 'USER' | 'NOUSER' | 'ADMIN') {
    this.roleSubject.next(value);
  }

  async loadUserRoleOnce(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ authority: string }>('https://localhost:8443/api/auth/me', {
          withCredentials: true,
        }).pipe(
          tap(res => {
            console.log('Роль з серверу:', res.authority);
          })
          // тут немає catchError - ми дозволяємо помилці "вилетіти"
        )
      );
      const mapped = this.mapBackendRole(response.authority);
      this.roleSubject.next(mapped);
      console.log('Роль після мапінгу і оновлення:', mapped);
    } catch (err) {
      console.error('Помилка при отриманні ролі', err);
      this.roleSubject.next('NOUSER');
    }
  }

  private mapBackendRole(role: string): 'DOCTOR' | 'JURIST' | 'CUSTOMER' | 'USER' | 'NOUSER' | 'ADMIN' {
    switch (role) {
      case 'ROLE_DOCTOR': return 'DOCTOR';
      case 'ROLE_JURIST': return 'JURIST';
      case 'ROLE_CUSTOMER': return 'CUSTOMER';
      case 'ROLE_USER': return 'USER';
      case 'ROLE_ADMIN': return 'ADMIN';
      default: return 'NOUSER';
    }
  }

  // emailConfirmation(code: string,) {
  //   return this.http.post<any>(`${this.baseApiUrl}/confirmations/linked-email?code=${encodeURIComponent(code)}`, null, { withCredentials: true });
  // }
  emailConfirmation(code: string) {
    return this.http.post(`${this.baseApiUrl}/confirmations/linked-email?code=${encodeURIComponent(code)}`, null, { withCredentials: true })
      .pipe(
        switchMap(() => {
          return from(this.loadUserRoleOnce());
        }),
      tap(() => {
        console.log('Роль успішно завантажена після email Confirmation');
      }),
      catchError(error => {
        console.error('Помилка підтвердження email:', error);
        return throwError(() => error);
      })
    );
  }

  // login(email: string, password: string) {
  //   return this.http.post<any>(`${this.baseApiUrl}/auth/login`, {email, password}, { withCredentials: true });
  // }
  login(email: string, password: string) {
    return this.http.post<{ authority: string }>(`${this.baseApiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        switchMap(() => {
          return from(this.loadUserRoleOnce());
        }),
        tap(() => {
          console.log('Роль успішно завантажена після логіну');
        }),
        catchError(error => {
          console.error('Помилка при логіні або завантаженні ролі:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.http.post(`${this.baseApiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        switchMap(() => {
          return from(this.loadUserRoleOnce());
        }),
        tap(() => {
          //this.roleSubject.next('NOUSER');
          console.log('Сесія завершена, роль скинута');
        }),
        catchError(error => {
          console.warn('Помилка у logout:', error);
          return of(null); // просто продолжаем, даже если ошибка
        }),
      ).subscribe();
  }

  newCodeRequest(email: string,) {
    return this.http.post<any>(`${this.baseApiUrl}/confirmations/linked-email/request?email=${email}`, null, { withCredentials: true });
  }

  isCustomer(): boolean {
    return this.role === 'CUSTOMER';
  }
  isVolunteer(): boolean {
    return (this.role === 'DOCTOR' || this.role === 'JURIST');
  }
  isDoctor(): boolean {
    return this.role === 'DOCTOR';
  }
  isJurist(): boolean {
    return this.role === 'JURIST';
  }
  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }
  isUser(): boolean {
    return this.role === 'USER';
  }
  isNoUser(): boolean {
    return this.role === 'NOUSER';
  }
  getRole(): string {
    return this.role;

  }
}















