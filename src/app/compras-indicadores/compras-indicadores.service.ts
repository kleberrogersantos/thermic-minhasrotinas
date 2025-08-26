import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComprasIndicadoresService {

  constructor(private http: HttpClient) { }

  url: string = 'http://192.168.0.11:9995/minhasrotinas';

  getData(initialBranch: string, finalBranch: string, initialDate: string, finalDate: string, initialProductId: string, finalProductId: string, initialType: string, finalType: string): Observable<any> {
    const params = new HttpParams()
      .set('initialBranch', initialBranch)
      .set('finalBranch', finalBranch)
      .set('initialDate', initialDate)
      .set('finalDate', finalDate)
      .set('initialProductId', initialProductId)
      .set('finalProductId', finalProductId)
      .set('initialType', initialType)
      .set('finalType', finalType);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Basic ' + btoa('Admin:teste@123') // cuidado com acentos especiais, use UTF-8 puro
    });


    // Ajuste a URL para sua API real
    const response = this.http.get<any>(`${this.url}/api/compras/indicadores`, { params, headers });
    //console.log('resposta:');
    //console.log(response);
    return response;

  }

  getSupplierDetails(
    initialBranch: string,
    finalBranch: string,
    initialDate: string,
    finalDate: string,
    initialProductId: string,
    finalProductId: string,
    initialType: string,
    finalType: string,
    supplierCode: string,
    supplierBranch: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('initialBranch', initialBranch)
      .set('finalBranch', finalBranch)
      .set('initialDate', initialDate)
      .set('finalDate', finalDate)
      .set('initialProductId', initialProductId)
      .set('finalProductId', finalProductId)
      .set('initialType', initialType)
      .set('finalType', finalType)
      .set('supplierCode', supplierCode)
      .set('supplierBranch', supplierBranch);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Basic ' + btoa('Admin:teste@123')
    });

    return this.http.get<any>(`${this.url}/api/compras/indicadores/detalhes-fornecedor`, { params, headers });
  }

  getPaymentDetails(
    initialBranch: string,
    finalBranch: string,
    initialDate: string,
    finalDate: string,
    initialProductId: string,
    finalProductId: string,
    initialType: string,
    finalType: string,
    paymentTermCode: string,
  ): Observable<any> {
    const params = new HttpParams()
      .set('initialBranch', initialBranch)
      .set('finalBranch', finalBranch)
      .set('initialDate', initialDate)
      .set('finalDate', finalDate)
      .set('initialProductId', initialProductId)
      .set('finalProductId', finalProductId)
      .set('initialType', initialType)
      .set('finalType', finalType)
      .set('paymentTermCode', paymentTermCode);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Basic ' + btoa('Admin:teste@123')
    });


    return this.http.get<any>(`${this.url}/api/compras/indicadores/detalhes-condicao-pagamento`, { params, headers });
  }

}


