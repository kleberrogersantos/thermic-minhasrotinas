import { AutenticaService } from './../login/autentica.service';
// src/app/guardas/guada.rotas.globalconfig.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guardaRotasApontamento: CanActivateFn = (route, state) => {
  const auth = inject(AutenticaService);
  const router = inject(Router);

  // ajuste a regra como você precisa
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};
