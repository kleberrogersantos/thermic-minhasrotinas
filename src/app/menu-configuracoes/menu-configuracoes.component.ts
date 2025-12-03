import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumbModule, PoDividerModule, PoImageModule, PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-menu-configuracoes',
  standalone: true,
  imports: [
    PoMenuModule,
    PoImageModule,
    PoToolbarModule,
    PoDividerModule,
    PoBreadcrumbModule,
    PoPageModule
  ],
  templateUrl: './menu-configuracoes.component.html',
  styleUrl: './menu-configuracoes.component.css'
})
export class MenuConfiguracoesComponent {

  constructor(private router: Router) {

  }

  menus: Array<PoMenuItem> = [
    { label: 'Trocar Senha', action: () => this.navegar(1), icon: 'an an-password', shortLabel: 'Trocar Senha' },
    { label: 'Voltar', action: () => this.navegar(99), icon: 'fa-solid fa-door-open', shortLabel: 'Voltar' }
  ]


  navegar(opcao: number) {

    if (opcao === 1) {
      this.router.navigate(['/trocarsenha']);
    } else if (opcao === 99) {
      this.router.navigate(['/home']);
    }

  }

}
