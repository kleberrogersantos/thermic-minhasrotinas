import { ApontamentosComponent } from './../apontamentos/apontamentos.component';
import { GlobalconfigComponent } from './../globalconfig/globalconfig.component';
import { PoNotificationModule, PoNotificationService } from '@po-ui/ng-components';
import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { PoPageLogin } from '@po-ui/ng-templates';
import { HttpHeaders } from '@angular/common/http';
import { RouterOutlet, RouterModule } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import api from '../http';

@Injectable({
  providedIn: 'root',

})

export class AutenticaService {

  private raw: any;
  private headers = new HttpHeaders();



  private usuarioAutenticado: boolean = false;

  constructor(
    public poNotification: PoNotificationService,
    private http: HttpClient,
    private router: Router,
    public usuario: Usuario
  ) {

  }



  async fazerLogin(formData: PoPageLogin) {

    //Ajuste o Header da requisição http
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    //A variável raw será utilizada no body da requisisção http
    //Os dados abaixo (login e password ) vieram do
    // formulário login.component.html

    this.raw = {
      username: formData.login,
      password: formData.password,
    };


    //Utiliza httpclient para fazer a requisição POST
    //ao serviço de Login do Back End TLPP:
    try {

      const response = await api.post(`minhasrotinas/login`, this.raw);

      //console.log('LOGIN - Credenciais:');
      //console.log(response.data);

      this.usuario.codigo = response.data.credenciais.codigo;
      this.usuario.nome = response.data.credenciais.login;
      this.usuario.senha = formData.password;
      this.usuario.credenciais = response.data.credenciais;
      this.usuario.bloqueado = response.data.credenciais.bloqueado;
      this.usuario.bloqueiaOP = response.data.credenciais.bloqueiaOP;
      this.usuario.apontador = response.data.credenciais.apontador;
      this.usuario.autenticado = true;
      this.usuario.alteraDatabase = response.data.credenciais.alteraDataBase;
      this.usuario.trocarSenha = response.data.credenciais.trocarSenha;

      //console.log(response.data);



      sessionStorage.setItem('mrUsuario', this.usuario.nome);
      sessionStorage.setItem('mrCodigoUsuario', this.usuario.codigo);
      sessionStorage.setItem('mrBloqueado', this.usuario.bloqueado);
      sessionStorage.setItem('mrEmpresas', JSON.stringify(response.data.credenciais.empresas));
      sessionStorage.setItem('mrBloqueiaOP', this.usuario.bloqueiaOP);
      sessionStorage.setItem('mrApontador', this.usuario.apontador);
      sessionStorage.setItem('mrAlteraDatabase', this.usuario.alteraDatabase);
      sessionStorage.setItem('mrTrocarSenha', this.usuario.trocarSenha);

      if (this.usuario.trocarSenha === 'sim') {
        this.poNotification.setDefaultDuration(2500);
        this.poNotification.warning('É necessário trocar a senha atual.');
        this.router.navigate(['/trocarsenha']);

      } else {
        this.poNotification.setDefaultDuration(2500);
        this.poNotification.success('Usuário autenticado!');
        this.router.navigate(['/globalconfig']);
        sessionStorage.setItem('mrLogado', 'sim');
        this.usuarioAutenticado = true;
        this.usuario.autenticado = true;
      }
    }

    catch (error: any) {
      this.usuarioAutenticado = false;
      this.usuario.autenticado = false;
      sessionStorage.setItem('mrLogado', 'não');
      //console.log(error);
      if ('message' in error && (error.message === 'Network Error' || error.message === 'Request failed with status code 500')) {
        this.poNotification.error('Falha de conexão com o servidor.');
      } else {
        this.poNotification.error('Falha na autenticação. Usuário e/ou senha incorretos.');
      }
    }





  }


}
