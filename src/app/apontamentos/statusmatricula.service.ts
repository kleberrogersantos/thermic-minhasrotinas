import { statusApontamentos } from './statusmatricula';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApontamentosComponent } from './apontamentos.component';


@Injectable({
  providedIn: 'root'
})
export class StatusmatriculaService {

  constructor(private http: HttpClient,
    public statusApontamentos: statusApontamentos,
  ) { }

  private mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  private headers = new HttpHeaders();

  public async retornaStatus(matricula: string) {

    this.statusApontamentos.ordem = '';
    this.statusApontamentos.operacao = '';
    this.statusApontamentos.apontamentos = [];

    //Ajuste o Header da requisição http
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };


    const url = sessionStorage.getItem('mrHost') + 'minhasrotinas';
    this.http.get<statusApontamentos>(
      url + '/statusmatricula?filial=' + this.mrCodigoEmpresa + '&matricula=' + matricula, //url
      httpOptions, //cabeçalho
    ).subscribe(
      (sucesso) => {
        this.statusApontamentos.ordem = sucesso.ordem;
        this.statusApontamentos.operacao = sucesso.operacao;
        this.statusApontamentos.apontamentos = sucesso.apontamentos;
        //console.log('dentro do subscribe');
        //console.log(this.statusApontamentos);
      }
      ,
      (erro) => {
        //console.log(erro)

      }
    )

    return this.statusApontamentos;


  }


  requisicao() {
    console.log('teste');
  }


}
