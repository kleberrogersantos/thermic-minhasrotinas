import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GlobalconfigComponent } from './globalconfig/globalconfig.component';
import { ApontamentosComponent } from './apontamentos/apontamentos.component';
import { guardaRotas } from './guardas/guarda.rotas';
import { guardaRotasGlobalConfig } from './guardas/guada.rotas.globalconfig';
import { guardaRotasApontamento } from './guardas/guarda.rotas.apontamentos';
import { RastreabilidadeOPComponent } from './rastreabilidade-op/rastreabilidade-op.component';
import { RastreabilidadeOpVinculoClienteComponent } from './rastreabilidade-op/rastreabilidade-op-vinculo-cliente/rastreabilidade-op-vinculo-cliente.component';
import { ProductionDocumentsComponent } from './production-documents/production-documents.component';
import { DocumentsReviewComponent } from './documents-review/documents-review.component';
import { MenuEstoqueComponent } from './menu-estoque/menu-estoque.component';
import { MenuProducaoComponent } from './menu-producao/menu-producao.component';
import { MenuProducaoDocumentosOpComponent } from './menu-producao/menu-producao-documentos-op/menu-producao-documentos-op.component';
import { UploadDocumentosComponent } from './menu-producao/menu-producao-documentos-op/upload-documentos/upload-documentos.component';
import { MenuEstoqueSolicitacaoArmazemComponent } from './menu-estoque/menu-estoque-solicitacao-armazem/menu-estoque-solicitacao-armazem.component';
import { ConsultaDocumentosComponent } from './menu-producao/menu-producao-documentos-op/consulta-documentos/consulta-documentos.component';
import { MenuConfiguracoesComponent } from './menu-configuracoes/menu-configuracoes.component';
import { TrocarSenhaComponent } from './menu-configuracoes/trocar-senha/trocar-senha.component';
import { MenuComprasComponent } from './menu-compras/menu-compras.component';
import { ComprasIndicadoresComponent } from './compras-indicadores/compras-indicadores.component';
import { ComprasConsultaSolicitacoesComponent } from './compras-consulta-solicitacoes/compras-consulta-solicitacoes.component';
import { RastreabilidadeOpVinculoDocumentoComponent } from './rastreabilidade-op/rastreabilidade-op-vinculo-documento/rastreabilidade-op-vinculo-documento.component';




export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [guardaRotas] },
  { path: 'configuracoes', component: MenuConfiguracoesComponent, canActivate: [guardaRotas] },
  { path: 'trocarsenha', component: TrocarSenhaComponent, canActivate: [guardaRotas] },
  { path: 'globalconfig', component: GlobalconfigComponent, canActivate: [guardaRotasGlobalConfig] },
  { path: 'apontamentos', component: ApontamentosComponent, canActivate: [guardaRotasApontamento] },
  { path: 'menuestoque', component: MenuEstoqueComponent, canActivate: [guardaRotas] },
  { path: 'solicitacaoarmazem', component: MenuEstoqueSolicitacaoArmazemComponent, canActivate: [guardaRotas] },
  { path: 'menuproducao', component: MenuProducaoComponent, canActivate: [guardaRotas] },
  { path: 'menucompras', component: MenuComprasComponent, canActivate: [guardaRotas] },
  { path: 'compras-indicadores', component: ComprasIndicadoresComponent, canActivate: [guardaRotas] },
  { path: 'compras-consulta-solicitacoes', component: ComprasConsultaSolicitacoesComponent, canActivate: [guardaRotas] },
  { path: 'menuproducaodocumentosop', component: MenuProducaoDocumentosOpComponent, canActivate: [guardaRotas] },
  { path: 'uploaddocumentos', component: UploadDocumentosComponent, canActivate: [guardaRotas] },
  { path: 'consultadocumentos', component: ConsultaDocumentosComponent, canActivate: [guardaRotas] },
  { path: 'rastreabilidadeOP', component: RastreabilidadeOPComponent, canActivate: [guardaRotas], },
  { path: 'vinculo-op-cliente', component: RastreabilidadeOpVinculoClienteComponent, canActivate: [guardaRotas] },
  { path: 'vinculo-op-documentos', component: RastreabilidadeOpVinculoDocumentoComponent, canActivate: [guardaRotas] },
  { path: 'productionsdocuments', component: ProductionDocumentsComponent, canActivate: [guardaRotas] },
  { path: 'documentsreviews', component: DocumentsReviewComponent },
];

