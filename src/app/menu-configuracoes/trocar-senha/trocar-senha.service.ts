import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrocarSenhaService {
  readonly url = 'http://192.168.0.11:9995/minhasrotinas';
  constructor(private http: HttpClient) { }

  async changePassword(payload: object): Promise<any> {

    try {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Admin:teste@123'),
          Accept: '*/*',
        }),
      };

      const response = await firstValueFrom(this.http.post(`${this.url}/changepassword`, payload, httpOptions));
      return response;

    } catch (error) {
      throw (error);
    }


  }
}
