import { Router, Routes } from '@angular/router';
import { routes } from './../app.routes';
import { Component, OnInit } from '@angular/core';
import { PoToolbarModule, PoButtonModule, PoCalendarModule, PoComboComponent, PoComboOption, PoComboOptionGroup, PoContainerModule, PoDividerModule, PoDynamicFormField, PoDynamicModule, PoFieldModule, PoImageModule, PoInfoModule, PoPageDefaultComponent, PoPageModule, PoMenuModule, PoMenuComponent } from '@po-ui/ng-components';
import { LoginComponent } from '../login/login.component';
import { Usuario } from '../login/usuario';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { APP_VERSION } from '../version';





@Component({
  selector: 'app-globalconfig',
  standalone: true,
  imports: [PoFieldModule,
    PoButtonModule,
    PoContainerModule,
    PoInfoModule,
    PoCalendarModule,
    PoImageModule,
    ReactiveFormsModule,
    FormsModule,
    PoMenuModule,
    PoToolbarModule,
    PoPageModule
  ],
  templateUrl: './globalconfig.component.html',
  styleUrl: './globalconfig.component.css'
})
export class GlobalconfigComponent implements OnInit {

  public formGlobal!: FormGroup;
  public DataBase: string = <any>new Date();
  public Empresa = JSON.parse(sessionStorage.getItem('mrEmpresas')!)[0].substring(0, 4);


  //Recupera informações gravadas na session
  //pelo serviço autentica.service
  nomeDoUsuario = sessionStorage.getItem('mrUsuario');
  Empresas = JSON.parse(sessionStorage.getItem('mrEmpresas')!);
  UsuarioBloqueado = sessionStorage.getItem('mrBloqueado');
  apontador = sessionStorage.getItem('mrApontador');
  alteraDatabase = sessionStorage.getItem('mrAlteraDatabase');
  bloqueiaDatabase: string = this.alteraDatabase !== 'sim' ? "true" : "false";

  appVersion: string = APP_VERSION; // Define a versão do aplicativo

  //define options para ser utilizado
  //no template globalconfig.component
  options!: Array<PoComboOption>
  public SelecaoAtual: string = 'teste';

  constructor(private router: Router,
    public usuario: Usuario,

  ) {


    //Percorre o array das empresas
    //e adiciona em options para ser apresentado no
    //p-combo das empresas
    this.options = []
    for (let nZ = 0; nZ < this.Empresas.length; nZ++) {
      //console.log(nZ);
      this.options.push({ value: this.Empresas[nZ].substring(0, 4), label: this.Empresas[nZ] })
    }

  }

  createForm() {
    this.formGlobal = new FormGroup({
      formDatabase: new FormControl(this.DataBase),
      formEmpresa: new FormControl(this.Empresa)
    });
  }

  voltarClick() {
    this.router.navigate(['/login']);
  };

  confirmarClick() {


    let dDataAux = this.formGlobal.value['formDatabase'];
    let dDataBase
    dDataBase = dDataAux.substring(8, 10) + '/' + dDataAux.substring(5, 7) + '/' + dDataAux.substring(0, 4)

    //Usei o for porque ainda não aprendi a usar o método find()
    let empresa: string = '';
    this.Empresa = this.formGlobal.value['formEmpresa'];
    for (let nZ = 0; nZ < this.Empresas.length; nZ++) {
      //console.log(this.Empresas[nZ].substring(0, 4) + ' --> ' + this.Empresa);
      if (this.Empresas[nZ].substring(0, 4) === this.Empresa) {
        empresa = this.Empresas[nZ]
        break;
      }
    }

    //console.log('Empresa logada :' + empresa);

    //Armazena DataBase informada e
    //empresa selecionada
    //console.log('DataBase: ');
    //console.log(dDataBase);
    sessionStorage.setItem('mrDataBase', dDataBase);
    sessionStorage.setItem('mrCodigoEmpresa', this.Empresa);
    sessionStorage.setItem('mrNomeEmpresa', empresa);


    if (this.apontador === 'sim') {
      //Se o usuário for um apontador, vai direto para a
      //rota de apontamentos
      this.router.navigate(['/apontamentos']);
    } else {
      //Navega para a página home
      this.router.navigate(['/home']);
    }

  };

  ngOnInit(): void {

    this.createForm();
    let nomeDoUsuario = localStorage.getItem('UsuarioLogado');


    this.bloqueiaDatabase = this.alteraDatabase !== 'sim' ? "true" : "false";

  }




}
