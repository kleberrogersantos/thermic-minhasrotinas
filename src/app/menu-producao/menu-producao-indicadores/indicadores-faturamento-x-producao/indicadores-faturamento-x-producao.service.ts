import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoComboOption } from '@po-ui/ng-components';
import { map, Observable } from 'rxjs';

interface GroupApiResponse {
  status: number;
  message: string;
  data: Array<{ code: string; description: string }>;
}

interface CustomerApiResponse {
  status: number;
  message: string;
  data: Array<{ id: string; name: string; branch: string }>;
}

export interface SalesCostingParams {
  branch: string; // ex: '0101'
  group: string; // ex: '103'
  customer?: string; // ex: '000123-01'
  dateFrom: string; // aaaammdd
  dateTo: string; // aaaammdd

  // >>> NOVOS PARÂMETROS OPCIONAIS PARA DETALHES <<<
  costDetails?: 'sim' | 'nao';
  documentNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class IndicadoresFaturamentoXProducaoService {
  readonly url = (sessionStorage.getItem('mrHost') || '') + 'minhasrotinas';

  constructor(private http: HttpClient) {}

  /** Retorna opções já no formato esperado pelo po-combo (Código-Descrição) */
  getGroups(): Observable<PoComboOption[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    return this.http
      .get<GroupApiResponse>(`${this.url}/api/pcp/groups`, httpOptions)
      .pipe(
        map((resp) =>
          (resp?.data || []).map((g) => ({
            value: g.code,
            label: `${g.code}-${g.description}`,
          }))
        )
      );
  }

  getCustomers(): Observable<PoComboOption[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    return this.http
      .get<CustomerApiResponse>(`${this.url}/api/pcp/customers`, httpOptions)
      .pipe(
        map((resp) =>
          (resp?.data || []).map((g) => ({
            value: `${g.id}-${g.branch}`,
            label: `${g.id}/${g.branch}-${g.name}`,
          }))
        )
      );
  }

  /** Busca os dados de custo x faturamento (resumo ou detalhes) */
  getSalesCosting(params: SalesCostingParams): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    const {
      branch,
      group,
      customer,
      dateFrom,
      dateTo,
      costDetails,
      documentNumber,
    } = params;

    let qs =
      `branch=${encodeURIComponent(branch)}` +
      `&group=${encodeURIComponent(group)}` +
      `&customer=${encodeURIComponent(customer || '')}` +
      `&datefrom=${encodeURIComponent(dateFrom)}` +
      `&dateto=${encodeURIComponent(dateTo)}`;

    // >>> AQUI ENTRA O COASTDETAILS E DOCUMENTNUMBER <<<
    if (costDetails) {
      // nome do parâmetro na TL++: coastDetails (como você comentou)
      qs += `&costDetails=${encodeURIComponent(costDetails)}`;
    }

    if (documentNumber) {
      qs += `&documentNumber=${encodeURIComponent(documentNumber)}`;
    }

    return this.http.get<any>(
      `${this.url}/api/pcp/sales-costing?${qs}`,
      httpOptions
    );
  }
}
