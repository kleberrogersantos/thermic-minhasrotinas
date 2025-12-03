import { Component, OnInit, ViewChild } from '@angular/core';
import { PoButtonModule, PoComboComponent, PoComboFilterMode, PoDividerModule, PoFieldModule, PoImageModule, PoLoadingModule, PoMenuComponent, PoMenuPanelComponent, PoMenuPanelItem, PoMenuPanelModule, PoNotificationService, PoPageAction, PoPageDefaultComponent, PoPageModule, PoTableColumn, PoTableModule, PoTabsModule, PoToolbarModule } from '@po-ui/ng-components';
import { ApiProtheusService } from './api-protheus.service';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_VERSION } from '../../version';


@Component({
    selector: 'app-rastreabilidade-op-vinculo-cliente',
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
        NgStyle,
        PoLoadingModule,
        FormsModule
    ],
    templateUrl: './rastreabilidade-op-vinculo-cliente.component.html',
    styleUrl: './rastreabilidade-op-vinculo-cliente.component.css'
})
export class RastreabilidadeOpVinculoClienteComponent implements OnInit {

  public menuItems: Array<PoMenuPanelItem> = []; //Definido no OnInit()
  tab1ativa: boolean = true;
  tab2ativa: boolean = true;

  @ViewChild('productionCombo', { static: true }) productionCombo!: PoComboComponent;

  comboItems: Array<{ label: string; value: any }> = [];
  selectedOP: any;
  opFilterMode = PoComboFilterMode.contains;

  comboCustomer: Array<{ label: string; value: any }> = [];
  selectedCustomer: any;
  customerFilterMode = PoComboFilterMode.contains;

  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  mrApontador = sessionStorage.getItem('mrUsuario');
  mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');
  mrTitulo: any;


  relationButtonHide: boolean = true;
  removeRelationButtonHide: boolean = true;
  comboCustomerHide: boolean = true;
  inputCustomerHide: boolean = true;
  title: string = 'Vinculo OP x Cliente';
  public actions: Array<PoPageAction> = []; //Definido no OnInit()
  isVisible: boolean = false;
  isHideLoading: boolean = true;
  textLoadingOverlay: string = '';

  columnsOP: Array<PoTableColumn> = [
    { property: 'numero', label: 'Número' },
    { property: 'emissao', label: 'Emissão' },
    { property: 'produto', label: 'Produto' },
    { property: 'descricao', label: 'Descrição' },
    { property: 'quantidade', label: 'Quantidade' }
  ];

  itemsOP: Array<any> = [];

  constructor(private ApiProtheusService: ApiProtheusService,
    private poNotification: PoNotificationService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.mrTitulo = APP_VERSION + ' | ' + this.mrNomeEmpresa + ' | ' + this.mrDataBase + ' | ' + this.mrUsuario;
    this.getNaoVinculados();

    this.menuItems = [
      { label: this.mrApontador === 'sim' ? 'Logoff' : 'Menu', action: this.LogOff.bind(this), icon: 'fa-solid fa-door-open' },

    ];


  }

  async getNaoVinculados() {

    try {

      this.textLoadingOverlay = 'Buscando Ops';
      this.isHideLoading = false;
      let resposta = await this.ApiProtheusService.getNaoVinculados();



      // Supondo que resposta seja um array de objetos, e que você quer popular o combo com label/value.
      // Ajuste os campos label e value conforme sua estrutura.
      this.comboItems = resposta.map(item => ({
        label: `${item.branch}-${item.orderId} ${item.customerName}`,//`${item.orderId} - Filial ${item.branch}`,
        value: item.branch + item.orderId
      }));

      this.isHideLoading = true;
      this.textLoadingOverlay = 'Buscando Ops';


    } catch (error) {
      this.isHideLoading = true;
      this.textLoadingOverlay = 'Buscando Ops';
      //console.log(error);
      this.poNotification.error('Erro ao buscar Ordens de Produção !')

    }



  }

  async onPOSelect(opSelecionada: any) {


    const opItem = this.comboItems.find(item => item.value === opSelecionada);

    this.selectedOP = opSelecionada;
    //const customerName = opSelecionada?.customerName?.trim();
    const customerName = opItem?.label.split(' ').slice(1).join(' ').trim(); // tudo após o primeiro espaço
    //console.log(`customerName=${customerName}`);
    const hasCustomer = !!customerName;
    this.relationButtonHide = hasCustomer;
    this.comboCustomerHide = hasCustomer;
    this.removeRelationButtonHide = !hasCustomer;
    this.inputCustomerHide = !hasCustomer;

    if (!hasCustomer) {

      try {

        this.textLoadingOverlay = 'Buscando Clientes';
        this.isHideLoading = false;
        let resposta = await this.ApiProtheusService.getClientes();
        //console.log(resposta);
        this.comboCustomer = resposta.map(item => ({
          label: `${item.customerId}-${item.customerName} | ${item.customarLocation}`,
          value: item.customerId
        }));

        this.isHideLoading = true;


      } catch (error) {
        this.isHideLoading = true;
        //console.log(error);
        this.poNotification.error('Erro ao buscar clientes !')

      }

    }


  }

  async onVincularClick() {

    //console.log('selectedOP:', this.selectedOP);
    //console.log('selectedCustomer:', this.selectedCustomer);

    if (!this.selectedOP || !this.selectedCustomer) {
      this.poNotification.warning('Selecione uma OP e um Cliente para vincular.');
      return;
    }

    // Localiza o item no comboItems com base no value selecionado
    const opItem = this.comboItems.find(item => item.value === this.selectedOP);

    if (!opItem) {
      this.poNotification.error('OP selecionada inválida.');
      return;
    }

    const branch = this.selectedOP.substring(0, 4);
    const productionId = this.selectedOP.substring(4); // restante da string

    const body = {
      branch: branch,
      productionId: productionId,
      customerId: this.selectedCustomer
    };


    try {
      this.textLoadingOverlay = 'Vinculando OP ao cliente';
      this.isHideLoading = false;

      const result = await this.ApiProtheusService.postVincular(body);

      this.poNotification.success(result.message);
      //console.log('Resposta do vínculo:', result);

      // Atualiza a tela se necessário
      this.selectedCustomer = '';
      this.selectedOP = '';
      await this.getNaoVinculados(); // ou outro método para atualizar a lista
      this.relationButtonHide = true;
      this.comboCustomerHide = true;
      this.removeRelationButtonHide = true;
      this.inputCustomerHide = true;

      this.productionCombo.focus();

    } catch (error) {
      console.error('Erro ao vincular:', error);
      this.poNotification.error('Erro ao vincular OP ao cliente.');
    } finally {
      this.isHideLoading = true;
    }
  }

  async onRemoverClick() {

    //console.log('selectedOP:', this.selectedOP);
    //console.log('selectedCustomer:', this.selectedCustomer);

    // Localiza o item no comboItems com base no value selecionado
    const opItem = this.comboItems.find(item => item.value === this.selectedOP);

    if (!opItem) {
      this.poNotification.error('OP selecionada inválida.');
      return;
    }

    const branch = this.selectedOP.substring(0, 4);
    const productionId = this.selectedOP.substring(4); // restante da string

    const body = {
      branch: branch,
      productionId: productionId
    };


    try {
      this.textLoadingOverlay = 'Removendo vinculo';
      this.isHideLoading = false;

      const result = await this.ApiProtheusService.postRemoverVinculo(body);

      this.poNotification.success(result.message);
      //console.log('Resposta do vínculo:', result);

      // Atualiza a tela se necessário
      this.selectedCustomer = '';
      this.selectedOP = '';
      await this.getNaoVinculados(); // ou outro método para atualizar a lista
      this.relationButtonHide = true;
      this.comboCustomerHide = true;
      this.removeRelationButtonHide = true;
      this.inputCustomerHide = true;

      this.productionCombo.focus();

    } catch (error) {
      console.error('Erro ao remover vinculo:', error);
      this.poNotification.error('Erro ao remover vinculo.');
    } finally {
      this.isHideLoading = true;
    }

  }

  LogOff(menu: PoMenuPanelItem) {
    if (this.mrApontador === 'sim') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/menuproducao']);
    }
  }


}
