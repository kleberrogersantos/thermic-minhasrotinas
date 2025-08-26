import { MenuEstoqueSolicitacaoArmazemService } from './menu-estoque-solicitacao-armazem.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PoButtonModule, PoComboOption, PoFieldModule, PoLoadingModule, PoMenuComponent, PoMenuItem, PoMenuModule, PoMenuPanelModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageAction, PoPageModule, PoSelectOption, PoTableAction, PoTableColumn, PoTableModule, PoTabsModule, PoToolbarModule } from '@po-ui/ng-components';
import { APP_VERSION } from '../../version';

@Component({
  selector: 'app-menu-estoque-solicitacao-armazem',
  standalone: true,
  imports: [
    PoToolbarModule,
    PoMenuPanelModule,
    PoPageModule,
    PoTabsModule,
    PoFieldModule,
    FormsModule,
    PoButtonModule,
    PoLoadingModule,
    PoTableModule,
    PoModalModule,
    PoMenuModule
  ],
  templateUrl: './menu-estoque-solicitacao-armazem.component.html',
  styleUrl: './menu-estoque-solicitacao-armazem.component.css'
})
export class MenuEstoqueSolicitacaoArmazemComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  constructor(private router: Router,
    private http: HttpClient,
    private MenuEstoqueSolicitacaoArmazemService: MenuEstoqueSolicitacaoArmazemService,
    private poNotification: PoNotificationService
  ) {

  }

  mrCodigoEmpresa: string = sessionStorage.getItem('mrCodigoEmpresa')!;
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  mrTitulo: any;

  menuItems: Array<PoMenuItem> = [{ label: 'Menu', action: this.LogOff.bind(this), icon: 'fa-solid fa-door-open', shortLabel: 'Sair' },];
  pagetitle: string = 'Solicitação ao Armazém';

  RequisitionTypeOptions: Array<PoSelectOption> = [];
  machineOptions: Array<PoComboOption> = [];
  machineInfo: Array<any> = [];
  employeeOptions: Array<PoComboOption> = [];
  requisitionOptions: Array<PoComboOption> = [];
  requisitionType: string = '';
  requisitionTitle: string = ''
  isHideLoading: boolean = true;
  costCenter: Array<PoComboOption> = [];
  productionIds: Array<PoComboOption> = [];
  productOptions: Array<PoComboOption> = [];
  productDetails: Array<any> = [];
  availableProductsDetails: Array<any> = [];
  requestOptionsDisabled: boolean = false;

  productTableColumns: Array<PoTableColumn> = [
    {
      property: 'productDescription',
      label: 'Código/Descrição'
    },
    {
      property: 'warehouseLocation',
      label: 'Local Estoque'
    },
    {
      property: 'productQuantity',
      label: 'Quantidade'
    }

  ]

  productTableItems: Array<any> = []

  tableFilterColumns: Array<PoTableColumn> = [
    // {
    //   property: 'productId', label: 'Código'
    // },
    {
      property: 'productUM', label: 'U.M.'
    },
    {
      property: 'stockBalance', label: 'Saldo'
    },
    {
      property: 'productName', label: 'Código/Descrição'
    },
    {
      property: 'warehouseLocation', label: 'Local Estoque'
    },
  ]

  tableFilterItems: Array<any> = []

  modalTile: string = 'Incluir produto';
  quantityAdd: number = 0;
  enteredProduct: string = '';
  filteredColumns: Array<string> = ['productName'];
  warehouseLocation: string = ''
  productTabActive: boolean = false;
  headTabActive: boolean = true;
  requestDestinationValue: string = '';
  machineValue: string = '';
  employeeValue: string = '';


  //https://fontawesome.com/icons/trash?f=classic&s=thin
  productTableActions: Array<PoTableAction> = [{ action: this.removeProduct.bind(this), label: '', icon: "fas fa-trash", type: 'danger' }]

  selectedId: string = '';
  selectedName: string = '';

  pageActions: Array<PoPageAction> = [{ action: this.onRequisitionSubmit.bind(this), label: 'Solicitar' },
  { action: this.modalOpen.bind(this), label: 'Adicionar' }
  ]
  availableProducts: boolean = true;

  async ngOnInit(): Promise<any> {

    this.mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa')!;
    this.mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
    this.mrDataBase = sessionStorage.getItem('mrDataBase');
    this.mrUsuario = sessionStorage.getItem('mrUsuario');

    this.mrTitulo = APP_VERSION + ' |' + this.mrNomeEmpresa + ' | ' + this.mrDataBase + ' | ' + this.mrUsuario;

    this.RequisitionTypeOptions = [{ value: 'CC', label: 'Centro de Custos' },
    { value: 'OP', label: 'Ordens de Produção' }
    ]
    this.requisitionType = 'CC';
    this.requisitionTitle = 'Centro de Custo'

    let response;
    try {
      this.isHideLoading = false;
      response = await this.MenuEstoqueSolicitacaoArmazemService.getRequisitionInfo(this.mrCodigoEmpresa);

      if (typeof response === "string") {
        this.poNotification.error(response);
      } else {
        if ("code" in response) {
          this.poNotification.error(response.message);
        } else {

          this.costCenter = response.costCenter;
          this.productionIds = response.productionIds;

          if (this.requisitionType === 'CC') {
            this.requisitionOptions = this.costCenter;
          } else {
            this.requisitionOptions = this.productionIds;
          }

          this.machineOptions = response.machines;
          this.machineInfo = response.machinesInfo;
          this.employeeOptions = response.employees;
          this.requestOptionsDisabled = false;
        }
      }

      this.isHideLoading = true;

    } catch (error: any) {
      this.requestOptionsDisabled = false;
      this.isHideLoading = true;
      this.poNotification.error(error);
    }

    try {
      const response = await this.MenuEstoqueSolicitacaoArmazemService.getProductInfo(this.mrCodigoEmpresa, '');
      if (typeof response === "string") {
        this.poNotification.error(response);
      } else {
        if ("code" in response) {
          this.poNotification.error(response.message);
        } else {

          //this.productOptions = response.products;
          this.productDetails = response.productsDetails;
          this.availableProductsDetails = this.productDetails.filter(product => product.stockBalance > 0);
        }
      }
    } catch (error: any) {
      this.isHideLoading = true;
      this.poNotification.error(error);
    }

  }


  requisitionTypeChange() {
    if (this.requisitionType === 'OP') {
      this.requisitionTitle = 'Ordem de Produção';
      this.requisitionOptions = this.productionIds;
    } else {
      this.requisitionOptions = this.costCenter;
      this.requisitionTitle = 'Centro de Custo';
    }
    this.requestDestinationValue = '';
    this.machineValue = '';
    this.requestOptionsDisabled = false;
  }

  async modalOpen() {

    this.productTabActive = true;
    this.headTabActive = false



    this.isHideLoading = false;
    if (this.availableProducts) {
      this.tableFilterItems = this.availableProductsDetails ?? [];
    } else {
      this.tableFilterItems = this.productDetails ?? [];
    }
    this.isHideLoading = true;
    this.poModal.open();






  }

  modalClean() {
    this.quantityAdd = 0;
  }

  modalConfirm() {

    if (this.quantityAdd <= 0) {
      this.poNotification.setDefaultDuration(3500);
      this.poNotification.warning('Informe uma quantidade maior que zero.')
    } else {

      if (this.productTableItems.some(item => item.productDescription === this.selectedName)) {
        this.poNotification.error('Produto já adicionado!');
      }
      else {
        //productTableItems
        this.poModal.close();

        this.productTableItems.push({
          productDescription: this.selectedName,
          warehouseLocation: this.warehouseLocation,
          productQuantity: this.quantityAdd
        });
      }



    }
  }

  onProductSelect(row: any) {
    this.warehouseLocation = row.warehouseLocation;
    this.selectedId = row.productId;
    this.selectedName = row.productName;
  }


  removeProduct(row: any) {
    //this.productTableItems = this.productTableItems.filter(p => p.productId !== this.itemToDelete.productId);
    this.productTableItems = this.productTableItems.filter(p => p.productDescription !== row.productDescription);
  }

  async onRequisitionSubmit() {

    if (this.requestDestinationValue === '') {
      let message: string = '';
      if (this.requisitionType === 'CC') {
        message = 'Centro de Custo não informado.'
      } else {
        message = 'Ordem de Produção não informada.'
      }
      this.poNotification.setDefaultDuration(4000);
      this.poNotification.warning(message);
      return
    }

    if (this.employeeValue === '') {
      this.poNotification.setDefaultDuration(4000);
      this.poNotification.warning('Matrícula não informada.');
      return
    }

    if (this.productTableItems.length === 0) {
      this.poNotification.setDefaultDuration(4000);
      this.poNotification.warning('Nenhum produto adicionado.');
      return

    }

    interface productItem {
      productId: string;
      warehouse: string;
      quantity: number
    }
    interface requestPayload {
      branch: string;
      dataBase: string;
      requester: string;
      requestType: string;
      requestDestinationValue: string;
      machine: string;
      employee: string;
      items: productItem[];
    }
    let payload: requestPayload = {
      branch: this.mrCodigoEmpresa,
      dataBase: this.mrDataBase!,
      requester: this.mrUsuario!,
      requestType: this.requisitionType,
      requestDestinationValue: this.requestDestinationValue,
      machine: this.machineValue,
      employee: this.employeeValue,
      items: []
    }

    for (let i = 0; i < this.productTableItems.length; i++) {
      payload.items.push({ productId: this.productTableItems[i].productDescription.split('-')[0], warehouse: this.productTableItems[i].warehouseLocation, quantity: this.productTableItems[i].productQuantity });
    }


    try {

      this.isHideLoading = false;
      this.pageActions[0].disabled = true;
      this.pageActions[1].disabled = true;
      const response = await this.MenuEstoqueSolicitacaoArmazemService.postWarehouseRequest(payload);
      this.pageActions[0].disabled = false;
      this.pageActions[1].disabled = false;

      if ('code' in response) {
        if (response.code === '200') {
          this.requestDestinationValue = '';
          this.machineValue = '';
          this.employeeValue = '';
          this.productTableItems = [];
          this.headTabActive = true;
          this.productTabActive = false;
          this.isHideLoading = true;
          this.poNotification.success(response.message);
        } else {
          this.isHideLoading = true;
          this.poNotification.error(response.message);
        }
      } else {
        this.isHideLoading = true;
        this.poNotification.error('Erro desconhecido na solicitação. Consulte log.');

      }

    } catch (error: any) {

      this.pageActions[0].disabled = false;
      this.pageActions[1].disabled = false;
      this.isHideLoading = true;

      this.poNotification.error(error.message);

    }


  }

  onHeadTabClick() {
    this.headTabActive = true;
    this.productTabActive = false;
  }

  onProductTabClick() {
    this.headTabActive = false;
    this.productTabActive = true;
  }


  machineChange() {


    if (this.requisitionType === 'CC') {
      const found = this.machineInfo.find(m => (m.machine === this.machineValue))
      if (this.requestDestinationValue = found) {
        this.requestDestinationValue = found.costCenter;
        this.requestOptionsDisabled = true;
      } else {
        this.requestOptionsDisabled = false;
      }
    }

  }

  productsFilter() {
    this.availableProducts = !this.availableProducts;
    if (this.availableProducts) {
      this.tableFilterItems = this.availableProductsDetails ?? [];
    } else {
      this.tableFilterItems = this.productDetails ?? [];
    }

  }
  LogOff() {
    this.router.navigate(['/menuestoque']);

  }
}
