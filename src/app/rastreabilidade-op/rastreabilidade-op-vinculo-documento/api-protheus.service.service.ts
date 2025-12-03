import { Injectable, OnInit } from '@angular/core';
import api from '../../http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiProtheusService {
  readonly url = sessionStorage.getItem('mrHost') + 'minhasrotinas';


  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');


  constructor(private http: HttpClient) { }


  public async getLinkedOrders(): Promise<any[]> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      let filial = this.mrCodigoEmpresa
      const response = await firstValueFrom(this.http.get<{ linkedProductionOrders: any[] }>(`${this.url}/vinculos/ops-vinculadas?branch=${filial}`, httpOptions));
      console.warn(`Resposta -->`);
      console.warn(response);
      return response.linkedProductionOrders;
    } catch (error) {
      throw (error);
    }
  }

  public async getAvailableDocuments(branch: string, productionId: string): Promise<any[]> {
    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      const response = await firstValueFrom(
        this.http.get<{ availableDocuments: any[] }>(
          `${this.url}/vinculos/available-documents?branch=${branch}&productionId=${productionId}`,
          httpOptions
        )
      );
      console.warn(`Resposta -->`);
      console.warn(response);
      return response.availableDocuments;
    } catch (error) {
      throw (error);
    }
  }

}
