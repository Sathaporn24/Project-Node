import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { PageTitleStrategy } from './shared/strategies/page-title.strategy';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { authKey } from './shared/services/account.service';
import { JwtModule } from "@auth0/angular-jwt";
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem(authKey.accessToken);
          },
          allowedDomains: environment.allowedDomains,
          disallowedRoutes: [],
        },
      }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([errorInterceptor]),
      withInterceptorsFromDi()
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
  ]
};