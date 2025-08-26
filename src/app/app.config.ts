import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';
import { LoginComponent } from './login/login.component';
import { Usuario } from './login/usuario';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Matriculas } from './apontamentos/matriculas';
import { MatriculasService } from './apontamentos/matriculas.service';
import { StatusmatriculaService } from './apontamentos/statusmatricula.service';
import { statusApontamentos } from './apontamentos/statusmatricula';
import { guardaRotas } from './guardas/guarda.rotas';
import { guardaRotasGlobalConfig } from './guardas/guada.rotas.globalconfig';
import { guardaRotasApontamento } from './guardas/guarda.rotas.apontamentos';
import api from './http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([PoHttpRequestModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    ReactiveFormsModule,
    FormsModule,
    Usuario,
    Matriculas,
    MatriculasService,
    StatusmatriculaService,
    statusApontamentos,
    guardaRotas,
    guardaRotasGlobalConfig,
    guardaRotasApontamento,
    importProvidersFrom(BrowserAnimationsModule)

  ],

};
