import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDocumentosService {
  readonly url = sessionStorage.getItem('mrHost') + 'minhasrotinas';

  constructor(private http: HttpClient) { }


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
}
