import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseTrackingServiceService {
  url: string = 'http://192.168.0.11:9995/minhasrotinas';

  constructor(private http: HttpClient) { }

  async getTracking(params: any): Promise<any[]> {
    const httpParams = new HttpParams()
      .set('initialBranch', params.initialBranch || '')
      .set('finalBranch', params.finalBranch || '')
      .set('initialDate', params.initialDate || '')
      .set('finalDate', params.finalDate || '')
      .set('initialRequest', params.initialRequest || '')
      .set('finalRequest', params.finalRequest || '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Authorization': 'Basic ' + btoa('Admin:teste@123')
    });

    // 1) Buscar como TEXTO para evitar parse automático do Angular
    const resp = await firstValueFrom(
      this.http.get(`${this.url}/api/compras/request-tracking`, {
        params: httpParams,
        headers,
        responseType: 'text',         // <--- chave
        observe: 'response'           // <--- para ver status/headers
      })
    ) as HttpResponse<string>;

    console.log('Resposta:', resp.body);
    const raw = resp.body ?? '';
    // Útil para auditoria:
    // console.log('Status:', resp.status, 'Content-Type:', resp.headers.get('content-type'));
    // console.log('Resposta BRUTA:', raw);

    // 2) Tentar parse direto
    try {
      return JSON.parse(raw);
    } catch (e: any) {
      // 3) Se falhar, tenta sanitizar (escapar quebras de linha/tabs/controls DENTRO de strings)
      const cleaned = escapeControlCharsInsideStrings(raw);

      try {
        const parsed = JSON.parse(cleaned);
        // Opcional: logar que precisou limpar
        console.warn('JSON continha caracteres de controle em strings. Foi saneado antes do parse.');
        return parsed;
      } catch (e2: any) {
        // Tentar extrair posição do erro, se existir
        const posMatch = String(e2?.message || e?.message || '')
          .match(/position\s+(\d+)/i);
        if (posMatch) {
          const idx = Number(posMatch[1]);
          const ctx = snippetAround(raw, idx, 120);
          console.error('Falha ao parsear JSON. Contexto próximo ao erro:\n', ctx);
        } else {
          console.error('Falha ao parsear JSON. Sem posição. Primeiros 800 chars:\n', raw.slice(0, 800));
        }
        // Repassar erro com corpo bruto para você ver no console/network
        throw new Error('JSON inválido do backend. Veja console para o trecho problemático.');
      }
    }
  }
}

/** Escapa \n \r \t e outros chars de controle (0x00–0x1F) DENTRO de strings JSON */
function escapeControlCharsInsideStrings(input: string): string {
  let out = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escaped) {
      // caractere após uma barra já é parte de escape existente
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      out += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }

    if (inString) {
      const code = ch.charCodeAt(0);
      // caracteres de controle não permitidos crus dentro de string JSON
      if (code >= 0 && code <= 0x1F) {
        switch (ch) {
          case '\n': out += '\\n'; break;
          case '\r': out += '\\r'; break;
          case '\t': out += '\\t'; break;
          default:
            const hex = code.toString(16).padStart(4, '0');
            out += '\\u' + hex; // \u0000 ... \u001f
        }
        continue;
      }
    }

    out += ch;
  }
  return out;
}

/** Mostra um “raio-x” ao redor do índice do erro para debugar rapidamente */
function snippetAround(s: string, idx: number, radius = 100): string {
  const start = Math.max(0, idx - radius);
  const end = Math.min(s.length, idx + radius);
  const prefix = `${start}..${idx}`;
  const suffix = `${idx}..${end}`;
  return (
    `--- contexto (${prefix}) ---\n` +
    s.slice(start, idx) +
    `\n>>>[AQUI idx=${idx}]<<<\n` +
    s.slice(idx, end) +
    `\n--- fim (${suffix}) ---`
  );
}
