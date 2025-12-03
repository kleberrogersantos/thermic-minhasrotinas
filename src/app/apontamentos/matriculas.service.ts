import { Matriculas } from './matriculas';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatriculasService {

  private mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  private headers = new HttpHeaders();

  // AGORA Matriculas é só um atributo da classe, não algo injetado
  private matriculasModel: Matriculas = new Matriculas();

  constructor(private http: HttpClient) { }

  buscaMatriculas(): Matriculas {

    this.matriculasModel.matriculas = [];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('Admin:teste@123'),
        Accept: '*/*',
      }),
    };

    const url = sessionStorage.getItem('mrHost') + 'minhasrotinas';

    this.http.get(
      url + '/matriculas?filial=' + this.mrCodigoEmpresa,
      httpOptions
    ).subscribe(
      (sucesso) => {
        this.matriculasModel.matriculas = (sucesso as any).matriculas;
      },
      (erro) => {
        // aqui eu deixaria vazio ao invés de pegar (erro as any).matriculas
        this.matriculasModel.matriculas = [];
        console.error(erro);
      }
    );

    return this.matriculasModel;
  };

}
