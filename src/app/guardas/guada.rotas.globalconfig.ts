import { routes } from './../app.routes';
import { Usuario } from './../login/usuario';
import { CanActivate, Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class guardaRotasGlobalConfig implements CanActivate {

    constructor(private usuario:Usuario,
      private router: Router
    ){

    };

    canActivate() {
      let mrLogado = sessionStorage.getItem('mrLogado');
      let usuarioAutenticado = mrLogado ==='sim';
      if(usuarioAutenticado)
      {
          return true;
      }
      else {
         this.router.navigate(['/login'])
         return false;
      }



    }
}
