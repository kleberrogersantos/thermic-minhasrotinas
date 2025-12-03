import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PoBreadcrumbModule, PoDividerModule, PoMenuItem, PoMenuModule, PoPageModule } from '@po-ui/ng-components';
import { RastreabilidadeOpVinculoClienteComponent } from './rastreabilidade-op-vinculo-cliente/rastreabilidade-op-vinculo-cliente.component';

@Component({
  selector: 'app-rastreabilidade-op',
  standalone: true,
  imports: [
    PoMenuModule,
    RouterModule,
    PoPageModule,
    PoDividerModule,
    PoBreadcrumbModule
  ],
  templateUrl: './rastreabilidade-op.component.html',
  styleUrl: './rastreabilidade-op.component.css'
})
export class RastreabilidadeOPComponent {

  subTitle: string = "";

  constructor(private router: Router) {

  }

  menus: Array<PoMenuItem> = [
    { label: 'Vinculo OP x Cliente', action: () => this.navegar(1), icon: 'an an-user-gear', shortLabel: 'Vinculo OP x Cliente' },
    { label: 'Vinculo OP x Documentos', action: () => this.navegar(2), icon: 'an an-file-doc', shortLabel: 'Vinculo OP x Documentos' },
    { label: 'Consultas.', action: () => this.navegar(3), icon: 'an an-magnifying-glass', shortLabel: 'Consultas' },
    { label: 'Menu', action: () => this.navegar(99), icon: 'fa-solid fa-door-open', shortLabel: 'Voltar ao Menu' }
  ]



  navegar(opcao: number) {

    if (opcao === 1) {
      this.subTitle = "[Vinculo OP x Cliente]";
      this.router.navigate(['/vinculo-op-cliente']);
    } else if (opcao == 2) {
      this.router.navigate(['/vinculo-op-documentos']);
    }
    else if (opcao === 99) {
      this.router.navigate(['/menuproducao']);
    }

  }


}
