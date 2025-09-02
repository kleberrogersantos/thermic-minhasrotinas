import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import api from '../../../http';


interface productionbyId {
  code: string;
  message: string;
  orderNumber: string;
  orderPartNumber: string;
  orderIssueDate: string;
  orderCloseDate: string;
  orderCustomer: string;
  orderDocuments: Array<string>;
}


@Injectable({
  providedIn: 'root'
})
export class ConsultaDocumentosService {
  readonly url = sessionStorage.getItem('mrHost') + 'minhasrotinas';

  constructor(private http: HttpClient,) { }
  private mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');


  async getProductionOrders(): Promise<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    return await firstValueFrom(this.http.get(`${this.url}/production-orders-query`, httpOptions));

  }

  async getOrderDocuments(productionId: string): Promise<productionbyId> {

    try {
      const response = await api.get(`minhasrotinas/queryorderdocuments?branc=${this.mrCodigoEmpresa}&productionId=${productionId}`);
      return response.data;

    }
    catch (error) {
      return JSON.parse(`{"code":500,"message :","${error}"}`);
    }
  }

  async downloadDocument(productionId: string, documentName: string, usercode: string, username: string) {
    const url = `minhasrotinas/downloadpodocument?productionId=${productionId}&document=${documentName}&usercode=${usercode}&username=${username}`;

    try {

      const response = await api.get(url, { responseType: 'blob' });

      // if (response.data.type !== 'application/octet-xxxstream') {
      //   throw new Error(response.data);
      // }

      // Criar URL temporária para o arquivo
      const blobUrl = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = documentName; // Nome do arquivo
      a.click();
      URL.revokeObjectURL(blobUrl); // Libera o recurso após o uso

    } catch (error) {
      throw (error);
    }
  }

  async removeDocuments(body: object) {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      const response = await firstValueFrom(this.http.post(`${this.url}/documents/remove-documents`, body, httpOptions));
      return response;

    } catch (error) {
      throw (error);
    }
  };


  async logDocuments(productionId: string) {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      //('production id: ' + productionId);
      const response = await firstValueFrom(this.http.get(`${this.url}/documents/document-logs?productionId=${productionId}`, httpOptions));
      //console.log(response);
      return response;

    } catch (error) {
      throw (error);
    }

  }

}
