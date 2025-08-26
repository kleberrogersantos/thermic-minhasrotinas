import { routes } from '../app.routes';
import { Usuario } from '../login/usuario';
import { CanActivate, Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class guardaRotasApontamento implements CanActivate {

  constructor(private usuario: Usuario,
    private router: Router
  ) {

  };

  canActivate() {
    let mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
    let mrLogado = sessionStorage.getItem('mrLogado');
    let usuarioAutenticado = mrLogado === 'sim' && mrCodigoEmpresa !== '' && mrCodigoEmpresa !== null;
    if (usuarioAutenticado) {
      console.log('Rota Ok');
      console.log('Empresa: ' + mrCodigoEmpresa);
      return true;
    }
    else {
      console.log('usuario não autenticado ')
      console.log(usuarioAutenticado);
      this.router.navigate(['/login'])
      return false;
    }



  }
}
