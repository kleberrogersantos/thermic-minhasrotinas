import { ConsultaDocumentosService } from './consulta-documentos.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PoButtonModule, PoComboFilterMode, PoComboOption, PoDividerModule, PoFieldModule, PoIconModule, PoLoadingModule, PoMenuPanelItem, PoMenuPanelModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageAction, PoPageDefault, PoPageModule, PoTableColumn, PoTableComponent, PoTableModule, PoToolbarModule, PoWidgetModule } from '@po-ui/ng-components';
import { APP_VERSION } from '../../../version';

@Component({
  selector: 'app-consulta-documentos',
  standalone: true,
  imports: [
    PoToolbarModule,
    PoMenuPanelModule,
    PoPageModule,
    PoFieldModule,
    PoWidgetModule,
    PoIconModule,
    PoButtonModule,
    PoLoadingModule,
    FormsModule,
    PoDividerModule,
    PoModalModule,
    PoTableModule
  ],
  templateUrl: './consulta-documentos.component.html',
  styleUrl: './consulta-documentos.component.css'
})
export class ConsultaDocumentosComponent implements OnInit {

  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario: string = sessionStorage.getItem('mrUsuario')!;
  mrCodigoUsuario: string = sessionStorage.getItem('mrCodigoUsuario')!;
  mrApontador = sessionStorage.getItem('mrUsuario');
  mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');
  mrTitulo: any;
  isHideLoading: boolean = true;
  textLoadingOverlay: string = '';
  filterMode: number = PoComboFilterMode.contains;
  productionOrderList: Array<PoComboOption> = [];
  productionId: string = '';
  pageDefaultActions: Array<PoPageAction> = [{ action: this.getDocuments.bind(this), label: 'Documentos', disabled: true, icon: 'fas fa-download' },
  { action: this.deleteDocuments.bind(this), label: 'Excluir Docs', disabled: true, icon: 'fas fa-trash' },
  { action: this.logDocuments.bind(this), label: 'Log Acessos', disabled: true, icon: 'fas fa-trash' }]

  infoProductionHidden: boolean = true;
  modalTile: string = 'Excluir Documentos';
  modalLogTile: string = 'Log dos Documentos';
  tableFileColumns: Array<PoTableColumn> = [{ property: 'fileName', label: 'Arquivo' }]
  logColumns: Array<PoTableColumn> = [
    { property: 'date', label: 'Data' },
    { property: 'time', label: 'Hora' },
    { property: 'username', label: 'Usuário' },
    { property: 'documentName', label: 'Documento' },
    { property: 'event', label: 'Evento' },
  ];
  logItems: Array<any> = [];
  tableFileItems: Array<any> = []

  public menuItems: Array<PoMenuPanelItem> = [{ label: 'Menu', action: this.LogOff.bind(this), icon: 'an an-sign-out' },];

  @ViewChild('avalaibleDocs', { static: true }) divElement!: ElementRef;
  @ViewChild('modalFile', { static: true }) poModal!: PoModalComponent;
  @ViewChild('modalLog', { static: true }) poModalLog!: PoModalComponent;
  @ViewChild('documentTable', { static: true }) poDocumentTable!: PoTableComponent;
  hiddenList: Array<boolean> = Array(20).fill(true);
  documentNames: Array<string> = Array(20).fill('');
  orderNumber: string = '';
  orderPartNumber: string = '';
  orderIssueDate: string = '';
  orderCloseDate: string = ''
  orderCustomer: string = ''
  availableDocumentsContent: string = ''
  documentsContent: string = ''
  selectedFile: string = '';




  constructor(private router: Router,
    private ConsultaDocumentosService: ConsultaDocumentosService,
    private poNotification: PoNotificationService
  ) {

  }
  async ngOnInit(): Promise<any> {


    this.mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
    this.mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
    this.mrDataBase = sessionStorage.getItem('mrDataBase');
    this.mrUsuario = sessionStorage.getItem('mrUsuario')!;
    this.mrCodigoUsuario = sessionStorage.getItem('mrCodigoUsuario')!;
    this.mrApontador = sessionStorage.getItem('mrApontador');
    this.mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');
    this.mrTitulo = APP_VERSION + ' | ' + this.mrNomeEmpresa + ' | ' + this.mrDataBase + ' | ' + this.mrUsuario;



    this.textLoadingOverlay = 'Buscando Ops';
    this.isHideLoading = false;
    const response = await this.ConsultaDocumentosService.getProductionOrders()
    this.isHideLoading = true;
    this.productionOrderList = response;



  }


  deleteDocuments() {

    this.tableFileItems = [];

    for (let i = 0; i < this.documentNames.length; i++) {
      if (this.documentNames[i]) {
        this.tableFileItems.push({ fileName: this.documentNames[i] });
      }

    }

    this.poModal.open()

  }


  async modalConfirm() {
    const selectedRows = this.poDocumentTable.getSelectedRows();

    const UserCode = this.mrCodigoUsuario;
    const userName = this.mrUsuario;


    this.poModal.close();
    let documents: {
      productionId: string,
      usercode: string,
      username: string,
      documentNames: string[]
    } = {
      productionId: this.productionId,
      usercode: this.mrCodigoUsuario,
      username: this.mrUsuario,
      documentNames: []
    }
    for (let i = 0; i < selectedRows.length; i++) {
      documents.documentNames.push(selectedRows[i].fileName);
    }

    if (documents.documentNames.length > 0) {

      this.isHideLoading = false;
      const response: any = await this.ConsultaDocumentosService.removeDocuments(documents);
      this.isHideLoading = true;
      if ('code' in response) {
        if (response.code === '200') {
          this.poNotification.success(response);
        } else if (response.code === '207') {
          this.poNotification.warning(response);
        } else {
          this.poNotification.error(response);
        }
      }
      else {
        this.poNotification.error(response);
      }
    }

    this.poModal.close();

    this.productionOrderListChange();

  }



  async getDocuments() {

    this.isHideLoading = false;

    let response: any = await this.ConsultaDocumentosService.getOrderDocuments(this.productionId);
    this.isHideLoading = true;
    if (typeof response === "string") {
      this.poNotification.error(response);
    } else {
      if ("code" in response) {
        if (response.code === "500") {
          this.poNotification.error(response.message)
        } else {
          if (response.code === "200") {

            this.orderNumber = response.orderNumber;
            this.orderPartNumber = response.orderPartNumber;
            this.orderIssueDate = response.orderIssueDate;
            this.orderCloseDate = response.orderCloseDate;
            this.orderCustomer = response.orderCustomer;


            this.infoProductionHidden = false;
            //available documents:
            this.availableDocumentsContent = '';
            this.documentsContent = '';
            for (let i = 0; i < response.orderDocuments.length; i++) {
              this.hiddenList[i] = false;
              this.documentNames[i] = response.orderDocuments[i];
            }

            if (response.orderDocuments.length > 0) {
              this.pageDefaultActions[1].disabled = false;
              this.pageDefaultActions[2].disabled = false;
            }
            else {
              this.pageDefaultActions[1].disabled = true;
              this.pageDefaultActions[2].disabled = false;
            }

          } else {
            this.poNotification.information(response.message)
          }
        }
      }
    }



  };
  productionOrderListChange() {


    this.orderNumber = '';
    this.orderPartNumber = '';
    this.orderIssueDate = '';
    this.orderCloseDate = '';
    this.orderCustomer = '';

    //available documents:
    this.availableDocumentsContent = '';
    this.documentsContent = '';
    for (let i = 0; i < 20; i++) {
      this.hiddenList[i] = true;
      this.documentNames[i] = '';
    }

    this.infoProductionHidden = true;

    this.pageDefaultActions[1].disabled = true;
    this.pageDefaultActions[2].disabled = true;


    this.pageDefaultActions[0].disabled = false;
    this.pageDefaultActions[2].disabled = false;
  }


  async downloadDocument(documentIndex: number) {

    try {
      const userCode = this.mrCodigoUsuario;
      const userName = this.mrUsuario;
      await this.ConsultaDocumentosService.downloadDocument(this.productionId, this.documentNames[documentIndex], userCode, userName);
    } catch (error: any) {
      if ('code' in error) {
        if (error.code === '500') {
          this.poNotification.error(error.message);
        }
      } else
        this.poNotification.error('Falha desconhecida no download.');
    }


  }


  onFileSelect(row: any) {
    this.selectedFile = row.fileName;
  }

  async logDocuments() {

    try {
      this.textLoadingOverlay = 'Gerando log';
      this.isHideLoading = false;
      const response: any = await this.ConsultaDocumentosService.logDocuments(this.productionId);
      const content = response.content;
      this.logItems = [];
      for (let i = 0; i < content.length; i++) {
        this.logItems.push({
          date: content[i].date,
          time: content[i].time,
          username: content[i].username,
          documentName: content[i].documentName,
          event: content[i].event,
        })
      }

      this.isHideLoading = true;

      this.poModalLog.open();

    } catch (error: any) {
      this.poNotification.error('Erro na consulta do log.')
      this.isHideLoading = true;
    }

  }

  LogOff() {
    this.router.navigate(['/menuproducaodocumentosop']);
  }

}
