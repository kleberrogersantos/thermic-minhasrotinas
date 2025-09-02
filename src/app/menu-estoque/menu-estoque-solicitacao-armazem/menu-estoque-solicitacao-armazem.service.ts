import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuEstoqueSolicitacaoArmazemService {
  readonly url = sessionStorage.getItem('mrHost') + 'minhasrotinas';
  constructor(private http: HttpClient) { }


  async getProductInfo(branch: string, enteredProduct: string): Promise<any> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };


      const data = await firstValueFrom(this.http.get(`${this.url}/productinfo?branch=${branch}&enteredproduct=${enteredProduct}`, httpOptions));
      return data;
    } catch (error) {
      throw error;
    }

  }

  async getRequisitionInfo(branch: string): Promise<any> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      const data = await firstValueFrom(this.http.get(`${this.url}/requisitioninfo?branch=${branch}`, httpOptions));
      return data;
    } catch (error) {
      throw error;
    }

  }

  async postWarehouseRequest(body: object): Promise<any> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      const response = await firstValueFrom(this.http.post(`${this.url}/warehouse-requests`, body, httpOptions));
      return response;

    } catch (error) {
      throw (error);
    }
  };

}
