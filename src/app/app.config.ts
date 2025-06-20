import {APP_INITIALIZER, ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {RoleService} from './data/services/role.service';
import {RoleGuard} from './data/services/roleGuard';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {CsrfInterceptor} from "./data/services/csrf.interseptor.service";

export function initRole(roleService: RoleService): () => Promise<void> {
  return () => roleService.loadUserRoleOnce();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
        withInterceptorsFromDi()
    ),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'uk' },
    RoleService,
    RoleGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initRole,
      deps: [RoleService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
  ],
};
