import { Component } from '@angular/core';
import { PoDividerModule, PoImageModule, PoMenuModule, PoToolbarModule, PoMenuItem, PoNotificationService, PoBreadcrumbModule, PoPageModule } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-estoque',
  standalone: true,
  imports: [
    PoMenuModule,
    PoImageModule,
    PoToolbarModule,
    PoDividerModule,
    PoBreadcrumbModule,
    PoPageModule
  ],
  templateUrl: './menu-estoque.component.html',
  styleUrl: './menu-estoque.component.css'
})
export class MenuEstoqueComponent {

  nomeDoUsuario = sessionStorage.getItem('mrUsuario');
  scrImage: string = '/assets/images/logo_thermic.png'
  heightImage: number = 170

  menus: Array<PoMenuItem> = [
    { label: 'Solicitação ao Armazém', action: () => this.navegar(1), icon: 'ph ph-hand-arrow-down', shortLabel: 'Solicitação Armazém' },
    { label: 'home', action: () => this.navegar(99), icon: 'fa-solid fa-door-open', shortLabel: 'Home' }
  ]


  constructor(private router: Router,
    private poNotification: PoNotificationService
  ) {

  }

  navegar(opcao: number) {

    if (opcao === 1) {
      this.router.navigate(['/solicitacaoarmazem']);
    }
    else if (opcao === 99) {
      this.router.navigate(['/home']);
    }

  }
}
