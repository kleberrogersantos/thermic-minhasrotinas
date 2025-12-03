// src/app/guardas/guarda.rotas.globalconfig.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Se "Usuario" for apenas modelo (dados), NÃO injete via construtor.
import { Usuario } from '../login/usuario';

@Injectable({ providedIn: 'root' }) // <-- registra o provider da guarda
export class GuardaRotasGlobalConfig implements CanActivate {

  constructor(
    private router: Router,
    // Se Usuario for um SERVICE com @Injectable({providedIn:'root'}), você pode injetar:
    // private usuario: Usuario
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const mrLogado = sessionStorage.getItem('mrLogado');
    const autenticado = mrLogado === 'sim';
    return autenticado ? true : this.router.parseUrl('/login');
  }
}
