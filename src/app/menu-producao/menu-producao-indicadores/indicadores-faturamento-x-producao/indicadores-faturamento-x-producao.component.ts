import {
  IndicadoresFaturamentoXProducaoService,
  SalesCostingParams,
} from './indicadores-faturamento-x-producao.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PoBreadcrumbModule,
  PoButtonModule,
  PoChartLabelFormat,
  PoChartModule,
  PoChartOptions,
  PoChartSerie,
  PoChartType,
  PoComboFilterMode,
  PoComboOption,
  PoDividerModule,
  PoFieldModule,
  PoIconModule,
  PoImageModule,
  PoLoadingModule,
  PoMenuItem,
  PoMenuModule,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageModule,
  PoPageSlideComponent,
  PoTableAction,
  PoTableComponent,
  PoTableModule,
  PoToolbarModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { PoTableColumn } from '@po-ui/ng-components';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-indicadores-faturamento-x-producao',
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
    CommonModule,
    PoFieldModule,
    FormsModule,
    PoChartModule,
    PoTableModule,
    PoModalModule,
    PoLoadingModule,
  ],
  templateUrl: './indicadores-faturamento-x-producao.component.html',
  styleUrl: './indicadores-faturamento-x-producao.component.css',
})
export class IndicadoresFaturamentoXProducaoComponent implements OnInit {
  @ViewChild('paramPageSlide') paramPageSlide!: PoPageSlideComponent;

  // modal de gráficos da nota
  @ViewChild('detalheGraficoModal') detalheGraficoModal!: PoModalComponent;

  // tabela principal de notas
  @ViewChild('tabelaNotas') tabelaNotas!: PoTableComponent;

  groupOptions: PoComboOption[] = [];
  customerOptions: PoComboOption[] = [];
  branch = '0101';
  selectedGroup: string | null = null;
  selectedCustomer: string | null = null;
  dataInicial: string | Date | null = null;
  dataFinal: string | Date | null = null;

  // resultado/estado
  dadosTabela: any[] = [];
  loading = false;
  loadingDetails = false; // overlay para detalhes

  graphicTotalType = PoChartType.Column;
  graphicMargemType = PoChartType.Gauge;
  readonly categories = ['Valores'];
  modalGraficosVisivel = false;

  MargemSeries: PoChartSerie[] = [
    { label: 'Margem (%)', data: [0], color: 'color-08' },
  ];

  // duas séries: Faturado e Custo
  series: PoChartSerie[] = [
    { label: 'Faturado (R$)', data: [0] },
    { label: 'Custo (R$)', data: [0], color: 'color-08' },
  ];

  totalFaturado = 0;
  totalCusto = 0;

  // colunas da tabela principal
  colunasTabela: PoTableColumn[] = [
    { property: 'doc', label: 'Nota Fiscal', type: 'string', width: '120px' },
    { property: 'issueDate', label: 'Emissão', type: 'string', width: '110px' },
    {
      property: 'total',
      label: 'Total Faturado',
      type: 'currency',
      width: '140px',
      color: this.getTotalColor.bind(this),
    },
    {
      property: 'cost',
      label: 'Custo Total',
      type: 'currency',
      width: '140px',
      color: this.getCostColor.bind(this),
    },
    {
      property: 'margem',
      label: 'Margem (%)',
      type: 'string',
      width: '100px',
      color: this.getMarginColor.bind(this),
    },
    {
      property: 'clientName',
      label: 'Cliente',
      type: 'string',
      width: '250px',
    },
    { property: 'product', label: 'Produto', type: 'string', width: '120px' },
    {
      property: 'description',
      label: 'Descrição',
      type: 'string',
      width: '320px',
    },
    { property: 'quantity', label: 'Qtd', type: 'number', width: '100px' },
    {
      property: 'unitPrice',
      label: '$ Unitário',
      type: 'currency',
      width: '130px',
    },
  ];

  // colunas para o detalhe de custos por nota (linha expandida)
  colunasDetalhe: PoTableColumn[] = [
    { property: 'op', label: 'OP', type: 'string', width: '120px' },
    { property: 'product', label: 'Produto', type: 'string', width: '100px' },
    {
      property: 'description',
      label: 'Descrição',
      type: 'string',
      width: '80px',
    },
    { property: 'type', label: 'Tipo', type: 'string', width: '40px' }, // ex: MP, PI, PA...
    { property: 'quantity', label: 'Qtd', type: 'number', width: '40px' },
    {
      property: 'unitCost',
      label: 'Custo Unit.',
      type: 'currency',
      width: '80px',
    },
    {
      property: 'totalCost',
      label: 'Custo Total',
      type: 'currency',
      width: '90px',
    },
  ];

  graphicTotalOptions: PoChartOptions = {
    axis: {
      labelType: PoChartLabelFormat.Currency,
    },
  };

  notaCostTypesColumns: PoTableColumn[] = [
    { property: 'type', label: 'Tipo', type: 'string', width: '80px' },
    { property: 'value', label: 'Valor', type: 'currency', width: '140px' },
    { property: 'percent', label: '%', type: 'string', width: '90px' },
  ];

  notaCostTypesItems: Array<{ type: string; value: number; percent: string }> =
    [];

  // ações dos 3 pontinhos da tabela
  tableActions: PoTableAction[] = [
    {
      label: 'Detalhar custos',
      icon: 'po-icon-list',
      action: (row: any) => this.carregarDetalhesNota(row, false),
    },
    {
      label: 'Custo por Tipo',
      icon: 'po-icon-chart-pie',
      action: (row: any) => this.carregarDetalhesNota(row, true),
    },
  ];

  // gráficos do modal de detalhes
  chartGaugeType = PoChartType.Gauge;
  chartPieType = PoChartType.Pie;
  notaGaugeSeries: PoChartSerie[] = [];
  notaPieSeries: PoChartSerie[] = [];
  notaSelecionada: any = null;

  constructor(
    private router: Router,
    private groupsService: IndicadoresFaturamentoXProducaoService,
    private poNotification: PoNotificationService
  ) {}

  groupsComboFilterMode = PoComboFilterMode.contains;
  customersComboFilterMode = PoComboFilterMode.contains;

  poPageDefaultActions = [
    {
      label: 'Parâmetros',
      action: () => this.paramPageSlideOpen(),
      icon: '',
      disabled: false,
    },
  ];

  menus: Array<PoMenuItem> = [
    {
      label: 'Sair',
      action: () => this.navegar(99),
      icon: 'fa-solid fa-door-open',
      shortLabel: 'Sair',
    },
  ];

  navegar(opcao: number) {
    if (opcao === 99) {
      this.router.navigate(['/home']);
    }
  }

  paramPageSlideOpen() {
    this.paramPageSlide.open();
  }

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe({
      next: (opts) => (this.groupOptions = opts),
      error: (err) => {
        console.error(err);
        this.poNotification.error('Falha ao carregar grupos.');
      },
    });
    this.groupsService.getCustomers().subscribe({
      next: (opts) => (this.customerOptions = opts),
      error: (err) => {
        console.error(err);
        this.poNotification.error('Falha ao carregar clientes.');
      },
    });
  }

  aplicar(): void {
    if (!this.selectedGroup || String(this.selectedGroup).trim() === '') {
      this.poNotification.warning('Selecione um grupo.');
      return;
    }
    if (!this.dataInicial || !this.dataFinal) {
      this.poNotification.warning('Preencha data inicial e data final.');
      return;
    }

    const dIni = this.toYYYYMMDD(this.dataInicial);
    const dFim = this.toYYYYMMDD(this.dataFinal);

    if (!dIni || !dFim) {
      this.poNotification.error(
        'Datas inválidas. Use dd/mm/aaaa, aaaa-mm-dd ou um Date válido.'
      );
      return;
    }
    if (dIni > dFim) {
      this.poNotification.warning(
        'Período inválido: data inicial maior que a final.'
      );
      return;
    }

    const params: SalesCostingParams = {
      branch: this.branch,
      group: this.selectedGroup,
      customer: this.selectedCustomer || '',
      dateFrom: dIni,
      dateTo: dFim,
    };
    this.loading = true;

    this.groupsService.getSalesCosting(params).subscribe({
      next: (resp) => {
        const root = resp || {};
        const data = root.data || root;
        this.paramPageSlide.close();

        this.loading = false;

        const sales = Array.isArray(data?.sales) ? data.sales : [];

        this.dadosTabela = sales.map((s: any) => {
          const faturado = this.toNumber(s.total);
          const custo = this.toNumber(s.cost);

          const margemCalc =
            faturado > 0 ? ((faturado - custo) / faturado) * 100 : 0;

          return {
            ...s,
            margem: margemCalc.toFixed(2) + ' %',
            status: margemCalc < 0 ? 'negativo' : 'normal',
            showDetail: false,
            costDetails: [],
          };
        });

        const totalFaturado = Number(
          sales
            .reduce((acc: number, it: any) => acc + this.toNumber(it?.total), 0)
            .toFixed(2)
        );

        const totalCusto = Number(
          sales
            .reduce((acc: number, it: any) => acc + this.toNumber(it?.cost), 0)
            .toFixed(2)
        );

        this.series = [
          {
            label: 'Faturado (R$)',
            data: [totalFaturado],
            tooltip: () => `Faturado: ${this.formatCurrency(totalFaturado)}`,
          },
          {
            label: 'Custo (R$)',
            data: [totalCusto],
            color: 'color-08',
            tooltip: () => `Custo: ${this.formatCurrency(totalCusto)}`,
          },
        ];

        this.totalFaturado = totalFaturado;
        this.totalCusto = totalCusto;

        const margemPercent =
          totalFaturado > 0
            ? Number(
                (((totalFaturado - totalCusto) / totalFaturado) * 100).toFixed(
                  2
                )
              )
            : 0;

        this.MargemSeries = [
          { label: 'Margem (%)', data: [margemPercent], color: 'color-08' },
        ];
      },
      error: (err) => {
        console.error(err);
        this.poNotification.error(
          'Erro ao buscar indicadores de Custo x Faturamento.'
        );
      },
      complete: () => (this.loading = false),
    });
  }

  // ================= DETALHES POR NOTA ===================

  /** Chama o serviço para buscar detalhes de custo da nota e, opcionalmente, abre o modal de gráficos */
  // ================= DETALHES POR NOTA ===================

  /** Chama o serviço para buscar detalhes de custo da nota e, opcionalmente, abre o modal de gráficos */
  // ================= DETALHES POR NOTA ===================

  /** Chama o serviço para buscar detalhes de custo da nota e, opcionalmente, abre o modal de gráficos */
  private carregarDetalhesNota(row: any, abrirModal: boolean): void {
    if (!this.selectedGroup || !this.dataInicial || !this.dataFinal) {
      this.poNotification.warning(
        'Defina o período e o grupo antes de detalhar a nota.'
      );
      return;
    }

    const dIni = this.toYYYYMMDD(this.dataInicial);
    const dFim = this.toYYYYMMDD(this.dataFinal);

    if (!dIni || !dFim) {
      this.poNotification.error('Datas inválidas para detalhamento.');
      return;
    }

    this.loadingDetails = true;

    const params: SalesCostingParams = {
      branch: this.branch,
      group: this.selectedGroup,
      dateFrom: dIni,
      dateTo: dFim,
      costDetails: 'sim',
      documentNumber: row.doc, // NF filtrada no back
    };

    this.groupsService.getSalesCosting(params).subscribe({
      next: (resp) => {
        const data = resp?.data || resp || {};
        const rawDetails: any[] = Array.isArray(data.costs) ? data.costs : [];
        const salesResp: any[] = Array.isArray(data.sales) ? data.sales : [];

        // 1) achar a linha de venda correspondente dentro da resposta de detalhes
        const linhaVenda = salesResp.find(
          (s) =>
            String(s.doc).trim() === String(row.doc).trim() &&
            String(s.serie).trim() === String(row.serie).trim() &&
            String(s.item).trim() === String(row.item).trim() &&
            String(s.product).trim() === String(row.product).trim()
        );

        const indexInterno = linhaVenda
          ? String(linhaVenda.index ?? '').trim()
          : '';

        console.log(
          'index original (tabela):',
          row.index,
          '| index interno (detalhes):',
          indexInterno
        );

        // 2) filtrar os costs usando o index interno
        let detalhesIndex: any[] = [];

        if (indexInterno !== '') {
          detalhesIndex = rawDetails.filter(
            (det) => String(det.index ?? '').trim() === indexInterno
          );
        }

        console.log(
          'Qtde de detalhes para index interno',
          indexInterno,
          ':',
          detalhesIndex.length
        );
        console.log(
          'Tipos encontrados (index interno apenas):',
          detalhesIndex.map((d) => d.type)
        );

        // fallback: se por algum motivo não achar nada, usa todos os detalhes da NF
        if (!detalhesIndex.length) {
          console.warn(
            'Nenhum detalhe encontrado só para o item, usando todos os detalhes da NF.'
          );
          detalhesIndex = rawDetails;
        }

        // monta totalCost / unitCost
        row.costDetails = detalhesIndex.map((det) => {
          const quantity = this.toNumber(det.quantity);
          const totalCost = this.toNumber(det.totalCost ?? det.cost ?? 0);
          const unitCost = quantity > 0 ? totalCost / quantity : 0;

          return {
            ...det,
            quantity,
            totalCost,
            unitCost,
          };
        });

        console.log('row.costDetails (length):', row.costDetails.length);
        console.log(
          'row.costDetails (primeiros 5):',
          row.costDetails.slice(0, 5)
        );

        // força refresh da tabela
        this.dadosTabela = [...this.dadosTabela];

        const idx = this.dadosTabela.indexOf(row);
        if (idx >= 0 && this.tabelaNotas) {
          this.tabelaNotas.expand(idx);
        }

        if (abrirModal) {
          this.montarGraficosNota(row);
          this.detalheGraficoModal.open();

          setTimeout(() => {
            this.notaGaugeSeries = [...this.notaGaugeSeries];
            this.notaPieSeries = [...this.notaPieSeries];
            this.modalGraficosVisivel = true;
          }, 0);
        }
      },
      error: (err) => {
        console.error(err);
        this.poNotification.error('Erro ao buscar detalhes de custo da nota.');
      },
      complete: () => {
        this.loadingDetails = false;
      },
    });
  }

  fecharModalDetalhes(): void {
    this.modalGraficosVisivel = false;
    this.detalheGraficoModal.close();
  }

  /** Monta gauge da margem + pizza de custos por tipo para a nota selecionada */
  private montarGraficosNota(row: any): void {
    this.notaSelecionada = row;

    const faturado = this.toNumber(row.total);
    const custo = this.toNumber(row.cost);

    // ===== GAUGE =====
    let margemPercent = 0;
    if (faturado > 0) {
      const bruto = faturado - custo;
      margemPercent = Number(((bruto / faturado) * 100).toFixed(2));
      if (!Number.isFinite(margemPercent)) {
        margemPercent = 0;
      }
    }

    this.notaGaugeSeries = [
      { label: 'Margem (%)', data: [margemPercent], color: 'color-08' },
    ];

    // ===== AGRUPA CUSTOS POR TIPO (MO / MP / OI / PI / SV ...) =====
    const detalhes: any[] = Array.isArray(row.costDetails)
      ? row.costDetails
      : [];

    const mapaTipos: { [tipo: string]: number } = {};

    console.log('row.costDetails (length):', detalhes.length);
    console.log('row.costDetails (primeiros 5):', detalhes.slice(0, 5));

    detalhes.forEach((det) => {
      const tipo = String(det.type || 'OUTROS').trim();
      const valor = this.toNumber(det.totalCost ?? det.cost ?? 0);

      mapaTipos[tipo] = (mapaTipos[tipo] || 0) + valor;
    });

    console.log('Mapa de tipos (somente index clicado):', mapaTipos);

    console.log('Mapa de tipos antes do filtro:', mapaTipos);
    const tiposValidos = Object.keys(mapaTipos).filter(
      (tipo) => this.toNumber(mapaTipos[tipo]) !== 0
    );

    const totalCustos = tiposValidos.reduce(
      (acc, tipo) => acc + this.toNumber(mapaTipos[tipo]),
      0
    );

    // ===== GRÁFICO DE PIZZA =====
    this.notaPieSeries = tiposValidos.map((tipo) => {
      const valor = this.toNumber(mapaTipos[tipo]);
      const valorFormatado = this.formatCurrency(valor);

      return {
        label: tipo, // MO, MP, OI...
        data: [Number(valor.toFixed(2))],
        tooltip: `${tipo}: ${valorFormatado}`,
      } as PoChartSerie;
    });

    // ===== TABELA (Tipo / Valor / %) =====
    this.notaCostTypesItems = tiposValidos.map((tipo) => {
      const valor = this.toNumber(mapaTipos[tipo]);
      const perc = totalCustos > 0 ? (valor / totalCustos) * 100 : 0;

      return {
        type: tipo,
        value: Number(valor.toFixed(2)), // PoTable type 'currency'
        percent:
          perc.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + ' %',
      };
    });

    console.log('Itens da tabela de tipos:', this.notaCostTypesItems);
  }

  // ================== HELPERS =====================

  private toYYYYMMDD(value: string | Date): string | null {
    if (value instanceof Date && !isNaN(value.getTime())) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, '0');
      const d = String(value.getDate()).padStart(2, '0');
      return `${y}${m}${d}`;
    }
    const raw = String(value).trim();
    if (/^\d{8}$/.test(raw)) return raw;
    const m1 = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m1) return `${m1[3]}${m1[2]}${m1[1]}`;
    const m2 = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m2) return `${m2[1]}${m2[2]}${m2[3]}`;
    return null;
  }

  private toNumber(v: any): number {
    if (v === null || v === undefined) {
      return 0;
    }

    // se já é number
    if (typeof v === 'number') {
      return Number.isFinite(v) ? v : 0;
    }

    let s = String(v).trim();

    if (!s) {
      return 0;
    }

    // tenta tratar formato "1.234,56" ou "1234,56"
    // remove separador de milhar e troca vírgula por ponto
    const temVirgula = s.indexOf(',') >= 0;
    const temPonto = s.indexOf('.') >= 0;

    if (temVirgula) {
      // "1.234,56" -> "1234,56"
      s = s.replace(/\./g, '');
      // "1234,56" -> "1234.56"
      s = s.replace(',', '.');
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }

  getTotalColor(row: any): string {
    return row.status === 'negativo' ? 'color-07' : 'color-03';
  }

  getCostColor(row: any): string {
    return row.status === 'negativo' ? 'color-07' : 'color-03';
  }

  getMarginColor(row: any): string {
    return row.status === 'negativo' ? 'color-07' : 'color-03';
  }

  private formatCurrency(value: number): string {
    if (value == null) {
      return 'R$ 0,00';
    }

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  exportCostsToExcel(): void {
    if (
      !this.notaSelecionada ||
      !Array.isArray(this.notaSelecionada.costDetails) ||
      !this.notaSelecionada.costDetails.length
    ) {
      this.poNotification.warning(
        'Não há dados de custo detalhados para exportar.'
      );
      return;
    }

    const detalhes: any[] = this.notaSelecionada.costDetails;

    const dadosPlanilha = detalhes.map((det) => {
      const quantity = this.toNumber(det.quantity);
      const totalCost = this.toNumber(det.totalCost ?? det.cost ?? 0);
      const unitCost = this.toNumber(
        det.unitCost ?? (quantity > 0 ? totalCost / quantity : 0)
      );

      // 🔹 Ajuste aqui o campo da OP conforme vier do back-end:
      //   productionOrder, productionId, op, orderNumber, etc.
      const op =
        String(
          det.productionOrder ??
            det.productionId ??
            det.op ??
            det.orderNumber ??
            ''
        ).trim() || '';

      return {
        OP: op, // número da OP
        Produto: det.product ?? '', // código do produto
        'Descrição Produto': det.description ?? '',
        'Tipo Custo': det.type ?? '', // MP, MO, OI, etc
        Quantidade: quantity,
        'Custo Unitário': Number(unitCost.toFixed(2)),
        'Custo Total': Number(totalCost.toFixed(2)),
      };
    });

    if (!dadosPlanilha.length) {
      this.poNotification.warning(
        'Não foi possível montar os dados de custo para exportação.'
      );
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosPlanilha);
    const workbook: XLSX.WorkBook = {
      Sheets: { Custos: worksheet },
      SheetNames: ['Custos'],
    };

    const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const numeroNF =
      this.notaSelecionada?.doc ??
      this.notaSelecionada?.documentNumber ??
      'nota';

    const fileName = `custos_detalhados_${numeroNF}.xlsx`;

    saveAs(blob, fileName);
  }
}
