import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumbModule, PoDividerModule, PoImageModule, PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-menu-compras',
  standalone: true,
  imports: [
    PoMenuModule,
    PoImageModule,
    PoToolbarModule,
    PoDividerModule,
    PoBreadcrumbModule,
    PoPageModule,
  ],
  templateUrl: './menu-compras.component.html',
  styleUrl: './menu-compras.component.css',
})
export class MenuComprasComponent {
  constructor(private router: Router) { }

  menus: Array<PoMenuItem> = [
    {
      label: 'Indicadores',
      action: () => this.navegar(1),
      icon: 'fa-solid fa-chart-simple',
      shortLabel: 'Indicadores',
    },
    {
      label: 'Consulta Solicitaçõs de Compras',
      action: () => this.navegar(2),
      icon: 'fa-solid fa-cart-shopping',
      shortLabel: 'Consulta Solcitações Compras',
    },
    {
      label: 'home',
      action: () => this.navegar(99),
      icon: 'fa-solid fa-door-open',
      shortLabel: 'Home',
    },
  ];

  navegar(opcao: number) {
    if (opcao === 1) {
      this.router.navigate(['/compras-indicadores']);
    } else if (opcao === 2) {
      this.router.navigate(['/compras-consulta-solicitacoes']);
    }
    else if (opcao === 99) {
      this.router.navigate(['/home']);
    }
  }
}
