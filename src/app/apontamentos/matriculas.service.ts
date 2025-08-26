import { Matriculas } from './matriculas';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MatriculasService {


  private mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  constructor(private http: HttpClient,
    private Matriculas: Matriculas,

  ) { }

  private raw: any;
  private headers = new HttpHeaders();


  buscaMatriculas(): Matriculas {

    this.Matriculas.matriculas = [];

    //Ajuste o Header da requisição http
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };


    this.http.get(
      'http://192.168.0.11:9995/minhasrotinas/matriculas?filial=' + this.mrCodigoEmpresa, //url
      httpOptions //cabeçalho
    ).subscribe(
      (sucesso) => {
        this.Matriculas.matriculas = (sucesso as any).matriculas;
      }
      ,
      (erro) => {
        this.Matriculas.matriculas = (erro as any).matriculas;
      }
    )

    return this.Matriculas;

  };

}
