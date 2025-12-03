import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' }) // ✅ dá o provider
export class guardaRotas implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
    const mrLogado = sessionStorage.getItem('mrLogado');
    const mrApontador = sessionStorage.getItem('mrApontador');

    const autenticado = mrLogado === 'sim'
      && !!mrCodigoEmpresa
      && mrApontador !== 'sim';

    if (autenticado) return true;

    const trocarSenha = sessionStorage.getItem('mrTrocarSenha') === 'sim';
    if (state.url.includes('/trocarsenha') && trocarSenha) return true;

    return this.router.parseUrl('/login');
  }
}
