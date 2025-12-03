import { Component, OnInit } from '@angular/core';
import { PoBreadcrumbModule, PoDividerModule, PoImageModule, PoMenuModule, PoPageModule, PoToolbarModule, PoMenuItem } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-producao-documentos-op',
  standalone: true,
  imports: [
    PoMenuModule,
    PoImageModule,
    PoToolbarModule,
    PoDividerModule,
    PoBreadcrumbModule,
    PoPageModule,


  ],
  templateUrl: './menu-producao-documentos-op.component.html',
  styleUrl: './menu-producao-documentos-op.component.css'
})
export class MenuProducaoDocumentosOpComponent implements OnInit {

  nomeDoUsuario = sessionStorage.getItem('mrUsuario');
  scrImage: string = '/assets/images/logo_thermic.png'
  heightImage: number = 170

  menus: Array<PoMenuItem> = [
    { label: 'UpLoad de documentos', action: () => this.navegar(1), icon: 'an an-upload', shortLabel: 'UpLoad' },
    { label: 'Consulta de documentos', action: () => this.navegar(2), icon: 'an an-file-magnifying-glass', shortLabel: 'Consulta' },
    { label: 'Voltar menu', action: () => this.navegar(99), icon: 'an an-sign-out', shortLabel: 'Voltar menu' }
  ]

  constructor(private router: Router,) {

  }

  navegar(opcao: number) {

    if (opcao === 1) {
      this.router.navigate(['/uploaddocumentos']);
    }
    else if (opcao === 2) {
      this.router.navigate(['/consultadocumentos']);
    }
    else if (opcao === 99) {
      this.router.navigate(['/menuproducao']);
    }

  }

  ngOnInit(): void {

  }

}
