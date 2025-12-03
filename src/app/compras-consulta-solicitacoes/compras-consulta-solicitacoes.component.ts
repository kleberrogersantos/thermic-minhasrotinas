
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoButtonModule,
  PoFieldModule,
  PoLoadingModule,
  PoMenuItem,
  PoMenuModule,
  PoNotificationService,
  PoPageModule,
  PoPageSlideComponent,
  PoPageSlideModule,
  PoTableColumn,
  PoTableModule,
  PoTagType,
  PoToolbarModule,
} from '@po-ui/ng-components';
import { PurchaseTrackingServiceService } from './purchase-tracking-service.service';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_VERSION } from '../version';


@Component({
    selector: 'app-compras-consulta-solicitacoes',
    imports: [
        PoPageSlideModule,
        PoPageModule,
        PoTableModule,
        PoButtonModule,
        PoFieldModule,
        FormsModule,
        PoLoadingModule,
        PoToolbarModule,
        PoMenuModule,
    ],
    templateUrl: './compras-consulta-solicitacoes.component.html',
    styleUrl: './compras-consulta-solicitacoes.component.css'
})
export class ComprasConsultaSolicitacoesComponent implements OnInit {
  @ViewChild('slideParams') slideParams!: PoPageSlideComponent;

  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa')!;
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  mrTitulo = '';

  isHideLoading: boolean = true;
  textLoading: string = 'Carregando...';

  params = {
    initialBranch: '',
    finalBranch: 'ZZZZ',
    initialDate: new Date(),
    finalDate: new Date(),
    initialRequest: '',
    finalRequest: 'ZZZZZZ',
  };

  columns: PoTableColumn[] = [
    { property: 'branchId', label: 'Filial' },
    { property: 'orderNumber', label: 'Solicitação' },
    { property: 'orderItem', label: 'Item' },
    { property: 'description', label: 'Descrição' },
    { property: 'quantity', label: 'Quantidade' },
    { property: 'issueDate', label: 'Data Emissão' },
    { property: 'requester', label: 'Solicitante' },
    { property: 'quotationNumber', label: 'Cotação' },
    {
      property: 'quotationStatus',
      label: 'Status Cotação',
      type: 'label',
      labels: [
        { value: 'Pendente', label: 'Pendente', type: PoTagType.Danger },
        { value: 'Finalizada', label: 'Finalizada', type: PoTagType.Success },
        { value: 'Em atualização', label: 'Em atualização', type: PoTagType.Info },
        { value: 'Em análise', label: 'Em análise', type: PoTagType.Warning },
      ],
    },
    //{ property: 'quotationStatus', label: 'Status Cotação' },
    { property: 'buyer', label: 'Compradora' },
    { property: 'poNumber', label: 'Pedido Compra' },
    { property: 'supplierName', label: 'Nome do Fornecedor' },
    { property: 'poDeliveryDate', label: 'Prev Inicial' },
    { property: 'poFollowUpDate', label: 'Prev Atualizada' },
    { property: 'invoiceNumber', label: 'Nota Fiscal' },
    { property: 'receiptDate', label: 'Dt Recebimento' },
  ];

  items: any[] = [];

  pageActions = [
    { label: 'Exportar', action: () => this.exportToExcel() },
    { label: 'Parâmetros', action: () => this.slideParams.open() },
  ];

  menuItems: Array<PoMenuItem> = [
    {
      label: 'Menu',
      action: this.LogOff.bind(this),
      icon: 'fa-solid fa-door-open',
      shortLabel: 'Sair',
    },
  ];

  constructor(
    private service: PurchaseTrackingServiceService,
    private poNotification: PoNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mrTitulo = `${APP_VERSION} ${this.mrNomeEmpresa} | ${this.mrDataBase} | ${this.mrUsuario}`;

    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    this.params.initialDate = sixMonthsAgo;
    this.params.finalDate = today;

    this.getData();
  }

  toInputDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  toApiDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  copyRequest() {
    if (this.params.initialRequest) {
      this.params.finalRequest = this.params.initialRequest;
    }
  }

  cancelParams() {
    this.slideParams.close();
  }

  confirmParams() {
    if (!this.params.initialDate || !this.params.finalDate) {
      this.poNotification.warning('Datas obrigatórias não preenchidas.');
      return;
    }

    this.getData();
    this.slideParams.close();
  }

  async getData() {
    const query = {
      initialBranch: this.params.initialBranch,
      finalBranch: this.params.finalBranch,
      initialDate: this.toApiDate(this.params.initialDate),
      finalDate: this.toApiDate(this.params.finalDate),
      initialRequest: this.params.initialRequest,
      finalRequest: this.params.finalRequest,
    };

    console.log(query);

    try {
      this.isHideLoading = false;
      const response: any = await this.service.getTracking(query);
      this.items = response.requests;
    } catch (error) {
      console.error('Erro ao buscar rastreamento:', error);
    } finally {
      this.isHideLoading = true;
    }
  }

  LogOff() {
    this.router.navigate(['/menucompras']);
  }

  exportToExcel() {
    const exportData = this.items.map((item) => {
      const row: any = {};
      this.columns.forEach((col) => {
        row[col.label ?? ''] = item[col.property ?? ''] ?? '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rastreamento');
    XLSX.writeFile(workbook, 'rastreamento_compras.xlsx');
  }
}
