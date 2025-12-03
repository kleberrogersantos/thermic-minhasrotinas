import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  PoButtonModule,
  PoDividerModule,
  PoFieldModule,
  PoLoadingModule,
  PoMenuPanelModule,
  PoModalModule,
  PoPageAction,
  PoPageModule,
  PoPageSlideComponent,
  PoTableColumn,
  PoTableModule,
  PoTabsModule,
  PoToolbarModule,
  PoNotificationService,
  PoMenuModule,
  PoMenuItem,
  PoTableAction,
  PoModalComponent
} from '@po-ui/ng-components';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { ComprasIndicadoresService } from './compras-indicadores.service';
import { APP_VERSION } from '../version';

@Component({
  selector: 'app-compras-indicadores',
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
    PoDividerModule,
    PoMenuModule,
  ],
  templateUrl: './compras-indicadores.component.html',
  styleUrl: './compras-indicadores.component.css'
})
export class ComprasIndicadoresComponent implements OnInit {
  constructor(
    private router: Router,
    private comprasIndicadoresService: ComprasIndicadoresService,
    private poNotification: PoNotificationService
  ) { }

  @ViewChild('parametersPageSlide') parametersPageSlide!: PoPageSlideComponent;
  @ViewChild('supplierModal') supplierModal!: PoModalComponent;
  @ViewChild('supplierSummaryModal') supplierSummaryModal!: PoModalComponent;

  // Sessão
  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa')!;
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');

  // Página
  mrTitulo = '';
  pagetitle = 'Indicadores de Compras';
  isHideLoading = true;

  // Parâmetros
  initialBranch = '0101';
  finalBranch = '0102';
  initialProductId = '';
  finalProductId = 'ZZZZZZZZZZZZZZZ';
  initialType = '';
  finalType = 'ZZ';
  processingRange = { start: '', end: '' };
  paymentTermActive = true;

  // Menu e ações da página
  menuItems: Array<PoMenuItem> = [
    {
      label: 'Menu',
      action: this.LogOff.bind(this),
      icon: 'fa-solid fa-door-open',
      shortLabel: 'Sair',
    },
  ];

  pageActions: PoPageAction[] = [
    { action: this.parameters.bind(this), label: 'Parâmetros' },
    { action: this.exportAllTables.bind(this), label: 'Exportar' },
  ];

  // Tabelas
  paymentTermColumns: PoTableColumn[] = [
    { property: 'conditionCode', label: 'Condição' },
    { property: 'description', label: 'Descrição' },
    { property: 'conditionType', label: 'Tipo' },
    { property: 'quantity', label: 'Quantidade' },
    {
      property: 'totalAmount',
      label: 'Total (R$)',
      type: 'currency',
      format: 'BRL',
    },
    { property: 'percentage', label: '% ', type: 'number' },
  ];
  paymentTermItems: any[] = [];

  purchaseOrdersDiscountColumns: PoTableColumn[] = [
    { property: 'branch', label: 'Filial' },
    { property: 'orderNumber', label: 'Pedido' },
    { property: 'supplierName', label: 'Fornecedor' },
    {
      property: 'total',
      label: 'Valor Mercadoria',
      type: 'currency',
      format: 'BRL',
    },
    {
      property: 'discount',
      label: 'Desconto (R$)',
      type: 'currency',
      format: 'BRL',
    },
    { property: 'discountPercent', label: 'Desconto (%)', type: 'number' },
  ];
  purchaseOrdersDiscountItems: any[] = [];

  purchaseOrdersDeliveryColumns: PoTableColumn[] = [
    { property: 'supplierCode', label: 'Código do Fornecedor' },
    { property: 'supplierBranch', label: 'Loja' },
    { property: 'supplierName', label: 'Nome do Fornecedor' },
    {
      property: 'averageDeliveryDays',
      label: 'Tempo Médio de Entrega (dias)',
      type: 'number',
    },
    {
      property: 'deliveryDeviationDays',
      label: 'Desvio Médio de Entrega (dias)',
      type: 'number',
    },
  ];

  purchaseOrdersDeliveryActions: Array<PoTableAction> = [
    { action: this.supplierDetails.bind(this), icon: 'an an-eye', label: '' },
  ];

  paymentTermActions: Array<PoTableAction> = [
    { action: this.paymentDetails.bind(this), icon: 'an an-eye', label: '' },
  ];

  purchaseOrdersDeliveryItems: any[] = [];

  supplierDetailsColumns: PoTableColumn[] = [
    { property: 'branch', label: 'Filial' },
    { property: 'orderNumber', label: 'Pedido' },
    { property: 'issueDate', label: 'Emissão' },
    { property: 'productId', label: 'Produto' },
    { property: 'description', label: 'Descrição' },
    { property: 'quantity', label: 'Quant', type: 'number' },
    { property: 'total', label: 'Total (R$)', type: 'currency', format: 'BRL' },
    { property: 'expectedDate', label: 'Dt Prev Entrega' },
    { property: 'receiptDate', label: 'Dt Receb' },
  ];

  supplierDetailsItems: any[] = [];

  priceEvolutionColumns: PoTableColumn[] = [];
  priceEvolutionItems: any[] = [];

  paymentTermsDetailsColumns = [
    { property: 'branch', label: 'Filial', width: '10%' },
    { property: 'orderNumber', label: 'Pedido', width: '14%' },
    { property: 'issueDate', label: 'Emissão', width: '14%' },
    { property: 'total', label: 'Total', type: 'number', decimals: 2, align: 'right', width: '12%' },
    { property: 'supplierName', label: 'Fornecedor', width: '50%' },
    { property: 'buyerName', label: 'Comprador', width: '20%' }

  ] as PoTableColumn[];

  paymentTermsDetailsItems: any[] = [];

  ngOnInit(): void {
    this.mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa')!;
    this.mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
    this.mrDataBase = sessionStorage.getItem('mrDataBase');
    this.mrUsuario = sessionStorage.getItem('mrUsuario');
    this.mrTitulo = `${APP_VERSION} ${this.mrNomeEmpresa} | ${this.mrDataBase} | ${this.mrUsuario}`;
  }

  LogOff() {
    this.router.navigate(['/menucompras']);
  }

  parameters() {
    this.parametersPageSlide.open();
  }

  async onRequestSubmit() {
    const initialDate = this.processingRange.start.replace(/-/g, '');
    const finalDate = this.processingRange.end.replace(/-/g, '');

    this.parametersPageSlide.close();
    this.isHideLoading = false;

    try {
      const response = await firstValueFrom(
        this.comprasIndicadoresService.getData(
          this.initialBranch,
          this.finalBranch,
          initialDate,
          finalDate,
          this.initialProductId,
          this.finalProductId,
          this.initialType,
          this.finalType
        )
      );

      this.paymentTermItems = response?.paymentTerm ?? [];
      this.purchaseOrdersDiscountItems = response?.purchaseOrders ?? [];
      this.purchaseOrdersDeliveryItems = response?.purchaseOrdersDelivery ?? [];

      const lastPricesArray = response?.lastPrices ?? [];

      this.priceEvolutionColumns = [
        { property: 'id', label: 'Produto' },
        { property: 'description', label: 'Descrição' },
      ];

      const maxPrices = Math.max(
        ...lastPricesArray.map((item: any) => item.lastPrices?.length || 0)
      );

      for (let i = 0; i < maxPrices; i++) {
        this.priceEvolutionColumns.push({
          property: `price${i + 1}`,
          label: `Preço ${i + 1}`,
          type: 'currency',
          format: 'BRL',
        });
      }

      this.priceEvolutionItems = lastPricesArray.map((item: any) => {
        const row: any = {
          id: item.id,
          description: item.description,
        };
        const prices = item.lastPrices || [];
        for (let i = 0; i < maxPrices; i++) {
          row[`price${i + 1}`] = prices[i] ?? 0;
        }
        return row;
      });
    } catch (error) {
      this.poNotification.error(
        'Falha ao buscar dados de indicadores de compras.'
      );
      console.error('Erro ao buscar dados:', error);
    } finally {
      this.isHideLoading = true;
    }
  }

  // ... exportAllTables e addLabelHeader seguem iguais ...
  async exportAllTables() {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // 1. Prazo Pagamento
    if (this.paymentTermItems.length) {
      const sheet = XLSX.utils.json_to_sheet(this.paymentTermItems, {
        skipHeader: true,
      });
      this.addLabelHeader(sheet, this.paymentTermColumns);
      this.formatSheet(sheet, {
        'Total (R$)': 'R$ #,##0.00',
        '% ': '0.00%',
      });
      XLSX.utils.book_append_sheet(workbook, sheet, 'Prazo Pagamento');
    }

    // 2. Desconto Compras
    if (this.purchaseOrdersDiscountItems.length) {
      const sheet = XLSX.utils.json_to_sheet(this.purchaseOrdersDiscountItems, {
        skipHeader: true,
      });
      this.addLabelHeader(sheet, this.purchaseOrdersDiscountColumns);
      this.formatSheet(sheet, {
        'Valor Mercadoria': 'R$ #,##0.00',
        'Desconto (R$)': 'R$ #,##0.00',
        'Desconto (%)': '0.00%',
      });
      XLSX.utils.book_append_sheet(workbook, sheet, 'Desconto Compras');
    }

    // 3. Prazo Entrega
    if (this.purchaseOrdersDeliveryItems.length) {
      const sheet = XLSX.utils.json_to_sheet(this.purchaseOrdersDeliveryItems, {
        skipHeader: true,
      });
      this.addLabelHeader(sheet, this.purchaseOrdersDeliveryColumns);
      this.formatSheet(sheet, {
        'Tempo Médio de Entrega': '0',
        'Desvio Médio de Entrega (dias)': '0',
      });
      XLSX.utils.book_append_sheet(workbook, sheet, 'Prazo Entrega');
    }

    // 4. Evolução Preço
    if (this.priceEvolutionItems.length) {
      const sheet = XLSX.utils.json_to_sheet(this.priceEvolutionItems, {
        skipHeader: true,
      });
      this.addLabelHeader(sheet, this.priceEvolutionColumns);

      const dynamicPriceFormats: { [key: string]: string } = {};
      this.priceEvolutionColumns.forEach((col) => {
        if (col.label?.startsWith('Preço')) {
          dynamicPriceFormats[col.label] = 'R$ #,##0.00';
        }
      });

      this.formatSheet(sheet, dynamicPriceFormats);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Evolução Preço');
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(
      blob,
      `indicadores_compras_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  private addLabelHeader(
    sheet: XLSX.WorkSheet,
    columns: PoTableColumn[]
  ): void {
    const labels = columns.map((col) => col.label || col.property || '');
    XLSX.utils.sheet_add_aoa(sheet, [labels], { origin: 'A1' });

    // Mapeia os dados que vieram com chaves 'property' para ficarem abaixo dos labels
    const range = XLSX.utils.decode_range(sheet['!ref']!);
    for (let C = 0; C < columns.length; C++) {
      const property = columns[C].property;
      for (let R = 1; R <= range.e.r; R++) {
        const sourceCell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!sourceCell) continue;

        // Move os valores da propriedade para a célula sob o label
        const label = columns[C].label;
        if (label && label !== property) {
          sheet[XLSX.utils.encode_cell({ r: R, c: C })] = { ...sourceCell };
        }
      }
    }
  }

  private formatSheet(
    sheet: XLSX.WorkSheet,
    formatMap: { [key: string]: string }
  ) {
    const range = XLSX.utils.decode_range(sheet['!ref']!);

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = sheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (!headerCell || typeof headerCell.v !== 'string') continue;

      const key = headerCell.v;
      const format = formatMap[key];
      if (!format) continue;

      for (let R = 1; R <= range.e.r; ++R) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = sheet[cellRef];

        if (cell && typeof cell.v === 'number') {
          cell.t = 'n';
          cell.z = format;

          if (format.includes('%')) {
            // 👇 Converte de 16.19 para 0.1619 (Excel entenderá como 16,19%)
            cell.v = cell.v / 100;
          }
        }
      }
    }
  }

  async supplierDetails(item: any) {
    const initialDate = this.processingRange.start.replace(/-/g, '');
    const finalDate = this.processingRange.end.replace(/-/g, '');

    this.isHideLoading = false;

    this.supplierDetailsItems = [];

    try {
      const response = await firstValueFrom(
        this.comprasIndicadoresService.getSupplierDetails(
          this.initialBranch,
          this.finalBranch,
          initialDate,
          finalDate,
          this.initialProductId,
          this.finalProductId,
          this.initialType,
          this.finalType,
          item?.supplierCode,
          item?.supplierBranch
        )
      );

      this.supplierDetailsItems = response || [];

      this.supplierModal.open();
    } catch (error) {
      this.poNotification.error('Erro ao buscar detalhes do fornecedor.');
      console.error('Erro detalhes fornecedor:', error);
    } finally {
      this.isHideLoading = true;
    }
  }

  exportSupplierDetails() {
    if (!this.supplierDetailsItems.length) {
      this.poNotification.warning('Nenhum dado para exportar.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(this.supplierDetailsItems, {
      skipHeader: true,
    });

    // Adiciona os headers
    this.addLabelHeader(worksheet, this.supplierDetailsColumns);

    // Aplica formatação
    this.formatSheet(worksheet, {
      'Total (R$)': 'R$ #,##0.00',
      Quant: '0',
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhes Fornecedor');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(
      blob,
      `detalhes_fornecedor_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  async paymentDetails(item: any) {
    const initialDate = this.processingRange.start.replace(/-/g, '');
    const finalDate = this.processingRange.end.replace(/-/g, '');

    this.isHideLoading = false;

    this.paymentTermsDetailsItems = [];

    try {
      const response = await firstValueFrom(
        this.comprasIndicadoresService.getPaymentDetails(
          this.initialBranch,
          this.finalBranch,
          initialDate,
          finalDate,
          this.initialProductId,
          this.finalProductId,
          this.initialType,
          this.finalType,
          item?.conditionCode
        )
      );

      this.paymentTermsDetailsItems = response || [];

      this.supplierSummaryModal.open()
    } catch (error) {
      this.poNotification.error('Erro ao buscar detalhes do fornecedor.');
      console.error('Erro detalhes fornecedor:', error);
    } finally {
      this.isHideLoading = true;
    }
  }

  exportSupplierSummary(): void {
    if (!this.paymentTermsDetailsItems?.length) {
      this.poNotification?.warning('Não há dados para exportar.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(this.paymentTermsDetailsItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ResumoFornecedor');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    const fileName = `resumo-fornecedor_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }
}
