import { ApplicationConfig, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { RoleService } from './data/services/role.service';
import { RoleGuard } from './data/services/roleGuard';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function initRole(roleService: RoleService): () => Promise<void> {
  return () => roleService.loadUserRoleOnce();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'uk' },
    RoleService,
    RoleGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initRole,
      deps: [RoleService],
      multi: true,
    }, provideAnimationsAsync(),
  ],
};
