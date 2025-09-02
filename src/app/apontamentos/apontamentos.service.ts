import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoComboOption } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import api from '../http';

interface respostaBloqueio {
  code: number
  message: string
}


@Injectable({
  providedIn: 'root'
})


export class ApontamentosService {

  readonly url = sessionStorage.getItem('mrHost') + 'minhasrotinas';

  constructor(private http: HttpClient) { }

  getMotivosRetrabalhos(): Observable<Array<PoComboOption>> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    return this.http.get<any>(`${this.url}/motivoretrabalho?filial=0101`, httpOptions);

  }

  async blockProduction(body: object): Promise<respostaBloqueio> {

    try {
      const response = await api.post(`minhasrotinas/bloqueiaop`, JSON.stringify(body));
      return response.data;
    }
    catch (error) {
      //console.log('deu ruim');
      //console.log(error);
      return JSON.parse(`{"code":500,"message :","${error}"}`);
    }
  }

  async unblockProduction(body: object): Promise<respostaBloqueio> {

    try {
      const response = await api.post(`minhasrotinas/desbloqueiaop`, JSON.stringify(body));
      return response.data;
    }
    catch (error) {
      return JSON.parse(`{"code":500,"message :","${error}"}`);
    }
  }




}
