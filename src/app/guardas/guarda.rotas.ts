import { routes } from './../app.routes';
import { Usuario } from './../login/usuario';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class guardaRotas implements CanActivate {

  constructor(private usuario: Usuario,
    private router: Router
  ) {

  };

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
    let mrLogado = sessionStorage.getItem('mrLogado');
    let mrApontador = sessionStorage.getItem('mrApontador');
    let usuarioAutenticado = mrLogado === 'sim' && mrCodigoEmpresa !== '' && mrCodigoEmpresa !== null && mrApontador != 'sim';
    if (usuarioAutenticado) {
      //console.log('Rota Ok');
      //console.log('Empresa: ' + mrCodigoEmpresa);
      return true;
    }
    else {
      const actualRoute = state.url;
      const trocarSenha: boolean = sessionStorage.getItem('mrTrocarSenha') === 'sim'
      if (actualRoute.includes('/trocarsenha') && trocarSenha) {
        return true;
      } else {
        //console.log('usuario não autenticado ')
        //console.log(usuarioAutenticado);
        this.router.navigate(['/login'])
        return false;
      }
    }



  }
}
