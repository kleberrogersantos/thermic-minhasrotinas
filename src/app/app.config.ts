// src/app/app.config.ts
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { LOCALE_ID } from '@angular/core';


// Se você usa módulos do PO-UI globalmente (opcional):
// Você pode importar apenas o que realmente usa (PoModule, PoTemplatesModule, etc.)
import { PoModule } from '@po-ui/ng-components';
// import { PoTemplatesModule } from '@po-ui/ng-templates';

// ⚠️ Não use PoHttpRequestModule com provideHttpClient; não é necessário.
// Remova qualquer import de PoHttpRequestModule do projeto.

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),   // HttpClient "standalone" + interceptors do DI
    provideAnimations(),                            // animações habilitadas
    importProvidersFrom(
      PoModule
      // , PoTemplatesModule
    ),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }
  ]
};

