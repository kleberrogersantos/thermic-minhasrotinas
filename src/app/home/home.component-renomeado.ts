import { Usuario } from './../login/usuario';
import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { PoBreadcrumbModule, PoDividerModule, PoImageModule, PoMenuComponent, PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule } from '@po-ui/ng-components';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PoMenuModule,
    PoImageModule,
    PoToolbarModule,
    PoDividerModule,
    PoBreadcrumbModule,
    PoPageModule

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  nomeDoUsuario = sessionStorage.getItem('mrUsuario');
  scrImage: string = '/assets/images/logo_thermic.png'
  heightImage: number = 170

  menus: Array<PoMenuItem> = [
    { label: 'Estoque/Almoxarifado', action: () => this.navegar(1), icon: 'an an-warehouse', shortLabel: 'Estoque/Almoxarifado' },
    { label: 'Produção', action: () => this.navegar(2), icon: 'an an-siren', shortLabel: 'PCP' },
    { label: 'Configurações', action: () => this.navegar(3), icon: 'an an-gear', shortLabel: 'Configurações' },
    { label: 'Logoff', action: () => this.navegar(99), icon: 'an an-sign-out', shortLabel: 'Logoff' }
  ]

  constructor(private router: Router,) {

  }

  navegar(opcao: number) {

    if (opcao === 1) {
      this.router.navigate(['/menuestoque']);
    }
    else if (opcao === 2) {
      this.router.navigate(['/menuproducao']);
    } else if (opcao === 3) {
      this.router.navigate(['/configuracoes']);
    }
    else if (opcao === 99) {
      this.router.navigate(['/login']);
    }

  }

}
