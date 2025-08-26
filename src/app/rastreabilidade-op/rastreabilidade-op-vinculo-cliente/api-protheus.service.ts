import { Injectable, OnInit } from '@angular/core';
import api from '../../http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiProtheusService implements OnInit {
  readonly url = 'http://192.168.0.11:9995/minhasrotinas';


  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');


  constructor(private http: HttpClient) { }


  public async getNaoVinculados(): Promise<any[]> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      let filial = this.mrCodigoEmpresa
      const response = await firstValueFrom(this.http.get<{ productionOrders: any[] }>(`${this.url}/vinculos/ops?branch=${filial}`, httpOptions));
      console.warn(`Resposta -->`);
      console.warn(response);
      return response.productionOrders;
    } catch (error) {
      throw (error);
    }
  }


  public async getClientes(): Promise<any[]> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      let filial = this.mrCodigoEmpresa
      const response = await firstValueFrom(this.http.get<{ customers: any[] }>(`${this.url}/vinculos/clientes?branch=${filial}`, httpOptions));
      console.warn(`Resposta -->`);
      console.warn(response);
      return response.customers;
    } catch (error) {
      throw (error);
    }
  }


  public async postVincular(body: object): Promise<any> {
    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };


      const response = await firstValueFrom(
        this.http.post<any>(`${this.url}/vinculos/vincular`, body, httpOptions)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }


  public async postRemoverVinculo(body: object): Promise<any> {
    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };


      const response = await firstValueFrom(
        this.http.post<any>(`${this.url}/vinculos/remover-vinculo`, body, httpOptions)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  ngOnInit(): void {



  }

}
