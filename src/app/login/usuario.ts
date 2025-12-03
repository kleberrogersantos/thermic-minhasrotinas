import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class Usuario {
  public codigo: string = '';
  public nome: string = '';
  public senha: string = '';
  public bloqueado: string = '';
  public bloqueiaOP: string = '';
  public apontador: string = '';
  public credenciais: Array<string> = [];
  public autenticado: boolean = false;
  public alteraDatabase: string = 'não';
  public trocarSenha: string = 'não';
}
