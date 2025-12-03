import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PoButtonModule, PoComboFilterMode, PoDividerModule, PoFieldModule, PoImageModule, PoLoadingModule, PoMenuPanelItem, PoMenuPanelModule, PoNotificationService, PoPageAction, PoPageModule, PoTableColumn, PoTableModule, PoTabsModule, PoToolbarModule } from '@po-ui/ng-components';
import { APP_VERSION } from '../../version';
import { ApiProtheusService } from './api-protheus.service.service';


@Component({
  selector: 'app-rastreabilidade-op-vinculo-documento',
  standalone: true,
  imports: [
    PoFieldModule,
    PoImageModule,
    PoTabsModule,
    PoTableModule,
    PoButtonModule,
    PoToolbarModule,
    PoMenuPanelModule,
    PoPageModule,
    PoDividerModule,
    PoLoadingModule,
    FormsModule,
  ],
  templateUrl: './rastreabilidade-op-vinculo-documento.component.html',
  styleUrl: './rastreabilidade-op-vinculo-documento.component.css'
})
export class RastreabilidadeOpVinculoDocumentoComponent implements OnInit {
  public menuItems: Array<PoMenuPanelItem> = []; //Definido no OnInit()
  title: string = 'Vinculo OP x Documentos';
  public actions: Array<PoPageAction> = []; //Definido no OnInit()
  isHideLoading: boolean = true;
  textLoadingOverlay: string = '';
  comboItems: Array<{ label: string; value: any }> = [];
  selectedOP: any;
  opFilterMode = PoComboFilterMode.contains;
  mrTitulo: any;
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  documentColumns: Array<PoTableColumn> = [
    { property: 'branch', label: 'Filial', width: '8%' },
    { property: 'quotationNumber', label: 'Nro Orçamento', width: '8%' },
    { property: 'quotationItem', label: 'Item Orçamento', width: '8%' },
    { property: 'salesOrderNumber', label: 'Nro Pedido', width: '8%' },
    { property: 'salesOrderItem', label: 'Item Pedido', width: '8%' },
    { property: 'quantity', label: 'Quantidade', width: '8%' },
  ];

  documentItems: Array<any> = [];

  constructor(
    private router: Router,
    private poNotification: PoNotificationService,
    private ApiProtheusService: ApiProtheusService
  ) { }

  ngOnInit(): void {
    this.mrTitulo =
      APP_VERSION +
      ' | ' +
      this.mrNomeEmpresa +
      ' | ' +
      this.mrDataBase +
      ' | ' +
      this.mrUsuario;

    this.menuItems = [
      {
        label: 'Menu',
        action: this.LogOff.bind(this),
        icon: 'fa-solid fa-door-open',
      },
    ];

    this.getLinkedOrders();
  }

  LogOff(menu: PoMenuPanelItem) {
    this.router.navigate(['/menuproducao']);
  }

  async getLinkedOrders() {
    try {
      this.textLoadingOverlay = 'Buscando Ops';
      this.isHideLoading = false;
      let resposta = await this.ApiProtheusService.getLinkedOrders();

      // Supondo que resposta seja um array de objetos, e que você quer popular o combo com label/value.
      // Ajuste os campos label e value conforme sua estrutura.
      this.comboItems = resposta.map((item) => ({
        label: `${item.branch}-${item.orderId} ${item.customerName}`, //`${item.orderId} - Filial ${item.branch}`,
        value: item.branch + item.orderId,
      }));

      this.isHideLoading = true;
      this.textLoadingOverlay = 'Buscando Ops';
    } catch (error) {
      this.isHideLoading = true;
      this.textLoadingOverlay = 'Buscando Ops';
      //console.log(error);
      this.poNotification.error('Erro ao buscar Ordens de Produção !');
    }
  }

  async onPOSelect(opSelecionada: any) {

    const opItem = this.comboItems.find(item => item.value === opSelecionada);
    this.selectedOP = opSelecionada;

    const branch = this.selectedOP.substring(0, 4);
    const productionId = this.selectedOP.substring(4); // restante da string
    console.log(`this.selectedOP = ${this.selectedOP}`);
    console.log(`branch = ${branch}`);
    console.log(`productionId = ${productionId}`);
    try {
      this.textLoadingOverlay = 'Buscando documentos';
      this.isHideLoading = false;

      const result = await this.ApiProtheusService.getAvailableDocuments(branch, productionId);

      this.documentItems = result;
      this.isHideLoading = true;
      this.textLoadingOverlay = '';

    } catch (error) {
      console.error('Erro ao vincular:', error);
      this.poNotification.error('Erro ao buscar documentos disponíveis.');
    } finally {
      this.isHideLoading = true;
    }

  }
}
