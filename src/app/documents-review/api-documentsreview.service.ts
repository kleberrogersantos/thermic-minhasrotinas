import { Injectable } from '@angular/core';
import api from '../http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
export class ApiDocumentsreviewService {

  constructor(private http: HttpClient) { }
  private mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');


  async getOrderDocuments(productionId: string): Promise<productionbyId> {

    try {
      const response = await api.get(`minhasrotinas/queryorderdocuments?branc=${this.mrCodigoEmpresa}&productionId=${productionId}`);
      //console.log(response.data);
      return response.data;

    }
    catch (error) {
      return JSON.parse(`{"code":500,"message :","${error}"}`);
    }
  }

  async downloadDocument(productionId: string, documentName: string) {
    const url = `minhasrotinas/downloadpodocument?productionId=${productionId}&document=${documentName}`;

    const response = await api.get(url, { responseType: 'blob' });
    //console.log('Download realizado com sucesso:', response.data);

    // Criar URL temporária para o arquivo
    const blobUrl = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = documentName; // Nome do arquivo
    a.click();
    URL.revokeObjectURL(blobUrl); // Libera o recurso após o uso
    // } catch (error) {
    // console.error('Erro ao baixar o arquivo:', error);
    // }
  }

}


