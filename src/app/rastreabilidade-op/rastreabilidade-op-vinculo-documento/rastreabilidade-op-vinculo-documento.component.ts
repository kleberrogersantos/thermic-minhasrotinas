import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PoButtonModule,
  PoComboFilterMode,
  PoDividerModule,
  PoFieldModule,
  PoImageModule,
  PoLoadingModule,
  PoMenuPanelItem,
  PoMenuPanelModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableModule,
  PoTabsModule,
  PoToolbarModule,
} from '@po-ui/ng-components';
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
  styleUrl: './rastreabilidade-op-vinculo-documento.component.css',
})
export class RastreabilidadeOpVinculoDocumentoComponent implements OnInit {
  public menuItems: Array<PoMenuPanelItem> = []; //Definido no OnInit()
  title: string = 'Vinculo OP x Documentos';
  public actions: Array<PoPageAction> = []; //Definido no OnInit()
  isHideLoading: boolean = true;
  textLoadingOverlay: string = '';
  comboItems: Array<{ label: string; value: any }> = [];
  customerOptions: Array<{ label: string; value: any }> = [];
  selectedOP: any;
  selectedCustomer: any;
  opFilterMode = PoComboFilterMode.contains;
  mrTitulo: any;
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  poColumns: Array<PoTableColumn> = [
    { property: 'branch', label: 'Filial', width: '6%' },
    { property: 'productionOrderId', label: 'Nro Ordem', width: '12%' },
    { property: 'productCode', label: 'Produto', width: '10%' },
    { property: 'productDescription', label: 'Descrição', width: '35%' },
    { property: 'issueDate', label: 'Emissão', width: '10%' },
    { property: 'quantity', label: 'Quantidade', width: '10%' },
    { property: 'linkedQuantity', label: 'Qtd vinculada', width: '10%' },
  ];

  poItems: Array<any> = [];

  poActions: PoTableAction[] = [
    {
      label: '',
      icon: 'an an-plus-circle',
      action: this.associateOrderProduction.bind(this),
    },
  ];

  constructor(
    private router: Router,
    private poNotification: PoNotificationService,
    private ApiProtheusService: ApiProtheusService,
  ) {}

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
    console.log('Iniciou o componente de vinculo OP x Documentos');
    //this.getLinkedOrders();
    this.getCustomers();
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

  async getCustomers() {
    console.log('executando getcustomers');
    try {
      this.textLoadingOverlay = 'Buscando Clientes';
      this.isHideLoading = false;

      let resposta = await this.ApiProtheusService.getCustomers();

      // Supondo que resposta seja um array de objetos, e que você quer popular o combo com label/value.
      // Ajuste os campos label e value conforme sua estrutura.
      this.customerOptions = resposta.map((item) => ({
        label: `${item.customerCode}-${item.customerBranch} ${item.customerName} (${item.cnpjNumber})`, //`${item.orderId} - Filial ${item.branch}`,
        value: item.customerCode + item.customerBranch,
      }));

      this.isHideLoading = true;
      this.textLoadingOverlay = 'Buscando Ops';
    } catch (error) {
      this.isHideLoading = true;
      this.textLoadingOverlay = 'Buscando Ops';
      //console.log(error);
      this.poNotification.error('Erro ao buscar clientes.');
    }
  }

  async onPOSelect(opSelecionada: any) {
    const opItem = this.comboItems.find((item) => item.value === opSelecionada);
    this.selectedOP = opSelecionada;

    const branch = this.selectedOP.substring(0, 4);
    const productionId = this.selectedOP.substring(4); // restante da string
    console.log(`this.selectedOP = ${this.selectedOP}`);
    console.log(`branch = ${branch}`);
    console.log(`productionId = ${productionId}`);
    try {
      this.textLoadingOverlay = 'Buscando documentos';
      this.isHideLoading = false;

      const result = await this.ApiProtheusService.getAvailableDocuments(
        branch,
        productionId,
      );

      this.poItems = result;
      this.isHideLoading = true;
      this.textLoadingOverlay = '';
    } catch (error) {
      console.error('Erro ao vincular:', error);
      this.poNotification.error('Erro ao buscar documentos disponíveis.');
    } finally {
      this.isHideLoading = true;
    }
  }

  async onCustomerSelect(selectedCustomer: any) {
    const opItem = this.comboItems.find(
      (item) => item.value === selectedCustomer,
    );
    this.selectedCustomer = selectedCustomer;

    const customerCode = this.selectedCustomer.substring(0, 6);
    const customerBranch = this.selectedCustomer.substring(6, 8);
    console.log(`this.selectedCustomer = ${this.selectedCustomer}`);
    console.log(`customerCode = ${customerCode}`);
    console.log(`customerBranch = ${customerBranch}`);
    try {
      this.textLoadingOverlay = 'Buscando OPs ...';
      this.isHideLoading = false;

      const result: any =
        await this.ApiProtheusService.getAvailableProductionsOrders(
          customerCode,
          customerBranch,
        );
      console.log('result = ');
      console.log(result);
      this.poItems = result;
      this.isHideLoading = true;
      this.textLoadingOverlay = '';
    } catch (error) {
      console.error('Erro ao vincular:', error);
      this.poNotification.error('Erro ao buscar ordens disponíveis.');
    } finally {
      this.isHideLoading = true;
    }
  }

  async associateOrderProduction(row: any) {
    console.log('Associando OP de produção ao documento ...');
    console.log(row);
  }
}
