import { UploadDocumentosService } from './upload-documentos.service';
import { Component, OnInit } from '@angular/core';
import { PoButtonModule, PoComboFilterMode, PoComboOption, PoFieldModule, PoIconModule, PoLoadingModule, PoMenuItem, PoMenuModule, PoMenuPanelItem, PoMenuPanelModule, PoPageModule, PoProgressModule, PoToolbarModule, PoUploadFile, PoWidgetModule } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APP_VERSION } from '../../../version';

@Component({
    selector: 'app-upload-documentos',
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
        PoProgressModule,
        PoMenuModule
    ],
    templateUrl: './upload-documentos.component.html',
    styleUrl: './upload-documentos.component.css'
})
export class UploadDocumentosComponent implements OnInit {


  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  mrCodigoUsuario = sessionStorage.getItem('mrCodigoUsuario');
  mrApontador = sessionStorage.getItem('mrUsuario');
  mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');
  mrTitulo: any;
  productionOrderList: Array<PoComboOption> = [];
  isHideLoading: boolean = true;
  textLoadingOverlay: string = 'Buscando OPs';
  filterMode: number = PoComboFilterMode.contains;
  urlUpLoadDocument: string = `${sessionStorage.getItem('mrHost')}minhasrotinas/uploaddocument`;
  productionId: string = '';
  sendFileAs: string = '';




  header = { 'Content-Type': 'multipart/form-data', Authorization: 'Basic ' + btoa('Admin:teste@123'), Accept: '*/*' };
  constructor(private router: Router,
    private UploadDocumentosService: UploadDocumentosService,
  ) {

  }

  public menuItems: Array<PoMenuItem> = [{ label: 'Menu', action: this.LogOff.bind(this), icon: 'fa-solid fa-door-open', shortLabel: 'Sair' },];

  async ngOnInit(): Promise<any> {

    this.mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
    this.mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
    this.mrDataBase = sessionStorage.getItem('mrDataBase');
    this.mrUsuario = sessionStorage.getItem('mrUsuario');
    this.mrCodigoUsuario = sessionStorage.getItem('mrCodigoUsuario');
    this.mrApontador = sessionStorage.getItem('mrApontador');
    this.mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');
    this.mrTitulo = APP_VERSION + ' | ' + this.mrNomeEmpresa + ' | ' + this.mrDataBase + ' | ' + this.mrUsuario;



    this.textLoadingOverlay = 'Buscando Ops';
    this.isHideLoading = false;
    const response = await this.UploadDocumentosService.getProductionOrders();
    this.isHideLoading = true;
    this.productionOrderList = response;


  }

  LogOff() {
    this.router.navigate(['/menuproducaodocumentosop']);
  }

  productionOrderListChange() {
    const UserCode = this.mrCodigoUsuario;
    const userName = this.mrUsuario;
    this.urlUpLoadDocument = `${sessionStorage.getItem('mrHost')}minhasrotinas/uploaddocument?productionId=${this.productionId}&username=${userName}&usercode=${UserCode}`;
    //console.log(` url que será chamada = ${this.urlUpLoadDocument}`);
  }



  onUploadFile(objeto: any) {

    //console.log('url:');
    //console.log(this.urlUpLoadDocument);
    if (this.sendFileAs.trim() !== '') {
      objeto.extraFormData = { newFileName: this.sendFileAs.trim() }
      return (objeto);
    }
  }
}
