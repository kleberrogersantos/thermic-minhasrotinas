import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumbModule, PoButtonModule, PoDividerModule, PoIconModule, PoImageModule, PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule, PoWidgetModule } from '@po-ui/ng-components';

@Component({
    selector: 'app-menu-producao-indicadores',
    imports: [
        PoMenuModule,
        PoImageModule,
        PoToolbarModule,
        PoDividerModule,
        PoBreadcrumbModule,
        PoPageModule,
        PoWidgetModule,
        PoIconModule,
        PoButtonModule,
        CommonModule
    ],
    templateUrl: './menu-producao-indicadores.component.html',
    styleUrl: './menu-producao-indicadores.component.css'
})
export class MenuProducaoIndicadoresComponent {


  constructor(private router: Router,) {

  }

  cards = [
    {
      title: 'Faturamento x Custos',
      description: 'Traz uma relação das notas fiscais faturadas em um período e seus respectivos custos de produção.',
      image: 'assets/images/indicadores/dashboard.png',
      link: '/menuproducao-indicadores-indicador01'
    },

  ];

  menus: Array<PoMenuItem> = [
    { label: 'Sair', action: () => this.navegar(99), icon: 'fa-solid fa-door-open', shortLabel: 'Sair' }
  ]


  navegar(opcao: number) {

    if (opcao === 99) {
      this.router.navigate(['/menuproducao']);
    }

  }

  navigate(link: string) {
    this.router.navigate([link]);
  }
}
