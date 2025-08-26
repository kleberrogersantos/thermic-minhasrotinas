import { Component } from '@angular/core';
import { PoDividerModule, PoImageModule, PoMenuModule, PoToolbarModule, PoMenuItem, PoBreadcrumbModule, PoPageModule } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-producao',
  standalone: true,
  imports: [
    PoMenuModule,
    PoImageModule,
    PoToolbarModule,
    PoDividerModule,
    PoBreadcrumbModule,
    PoPageModule


  ],
  templateUrl: './menu-producao.component.html',
  styleUrl: './menu-producao.component.css'
})
export class MenuProducaoComponent {

  nomeDoUsuario = sessionStorage.getItem('mrUsuario');
  scrImage: string = '/assets/images/logo_thermic.png'
  heightImage: number = 170

  menus: Array<PoMenuItem> = [
    { label: 'Apontamento Simplificado', action: () => this.navegar(1), icon: 'ph ph-pencil', shortLabel: 'Apontamentos' },
    { label: 'Rastreabilidade da OP', action: () => this.navegar(2), icon: 'ph ph-file-magnifying-glass', shortLabel: 'Rastreabilide OP' },
    { label: 'Documentos da OP', action: () => this.navegar(3), icon: 'ph ph-file-doc', shortLabel: 'Documentos da OP' },
    { label: 'Home', action: () => this.navegar(99), icon: 'fa-solid fa-door-open', shortLabel: 'Home' }
  ]

  constructor(private router: Router,) {

  }

  navegar(opcao: number) {

    if (opcao === 1) {
      this.router.navigate(['/apontamentos']);
    }
    else if (opcao === 2) {
      this.router.navigate(['/rastreabilidadeOP']);
    }
    else if (opcao === 3) {
      this.router.navigate(['/menuproducaodocumentosop']);
    }
    else if (opcao === 99) {
      this.router.navigate(['/home']);
    }

  }
}
