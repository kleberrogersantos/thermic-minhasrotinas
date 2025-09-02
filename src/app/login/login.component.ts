import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import {
  PoPageLogin,
  PoPageLoginAuthenticationType,
  PoPageLoginModule,
} from '@po-ui/ng-templates';
import {
  PoDialogService,
  PoHttpRequestModule,
  PoMenuPanelModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';
import { PoDialogModule } from '@po-ui/ng-components';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { AutenticaService } from './autentica.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PoToolbarModule,
    PoMenuPanelModule,
    PoPageModule,
    PoToolbarModule,
    PoPageLoginModule,
    PoHttpRequestModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent implements OnInit {

  public loadingPassword: boolean = false;
  constructor(
    private AutenticaService: AutenticaService
  ) { }

  //Função que faz a chamada do serviço
  //de execução de login em autentica.service.ts

  async fazerLogin(formData: PoPageLogin) {

    this.loadingPassword = true;
    await this.AutenticaService.fazerLogin(formData);
    this.loadingPassword = false;

  }

  ngOnInit(): void {

    sessionStorage.setItem('mrLogado', 'não');

    const host = window.location.hostname;
    console.log(`host no login = ${host}`);
    if (host.includes('thermic.ddns.net')) {
      sessionStorage.setItem('mrHost', 'http://thermic.ddns.net:9995/');
      console.log('host externo');
    } else {
      sessionStorage.setItem('mrHost', 'http://192.168.0.11:9995/');
      console.log('host interno');
    }


  }

}
