import { ApontamentosService } from './apontamentos.service';
import { StatusmatriculaService } from './statusmatricula.service';
import { Matriculas } from './matriculas';
import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { PoButtonModule, PoComboOption, PoDialogModule, PoDialogService, PoDividerModule, PoFieldModule, PoGridModule, PoInputComponent, PoLoadingModule, PoMenuItem, PoMenuModule, PoMenuPanelModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageAction, PoPageModule, PoPageSlideComponent, PoPageSlideModule, PoTableModule, PoToolbarModule } from '@po-ui/ng-components';
import { PoMenuPanelItem } from '@po-ui/ng-components';
import { MatriculasService } from './matriculas.service';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { statusApontamentos } from './statusmatricula';
import api from '../http';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APP_VERSION } from '../version';




@Component({
  selector: 'app-apontamentos',
  standalone: true,
  imports: [PoPageModule,
    PoToolbarModule,
    PoMenuPanelModule,
    PoFieldModule,
    PoGridModule,
    ReactiveFormsModule,
    FormsModule,
    PoLoadingModule,
    PoModalModule,
    PoPageSlideModule,
    PoButtonModule,
    PoDialogModule,
    PoDividerModule,
    PoMenuModule

  ],
  templateUrl: './apontamentos.component.html',
  styleUrl: './apontamentos.component.css'
})
export class ApontamentosComponent implements OnInit {

  //@ViewChild(PoInputComponent, { static: true }) inputMatricula: PoInputComponent;
  @ViewChild('pageSlide') pageSlide!: PoPageSlideComponent;
  @ViewChild('inputMatricula') inputMatricula!: PoInputComponent;
  @ViewChild('modalDesbloqueiaOP') modalDesbloqueiaOP!: PoModalComponent;
  @ViewChild('modalService') modalService!: PoModalComponent;


  sizePageSlide: string = "sm";
  //recupera dados do login:
  mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
  mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
  mrDataBase = sessionStorage.getItem('mrDataBase');
  mrUsuario = sessionStorage.getItem('mrUsuario');
  mrApontador = sessionStorage.getItem('mrUsuario');
  mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');
  mrTitulo: any;
  private recno: number = 0;
  Matriculas!: Matriculas;
  private statusApontamentos!: statusApontamentos;
  listaDeOperacoes: Array<PoComboOption> = [];
  servicesList: Array<PoComboOption> = [];
  listaRetrabalhos: Array<PoComboOption> = [];
  opRetrabalho: string = '';
  obsRetrabalho: string = '';
  motivoRetrabalho: string = '';
  //Propriedades do form:
  public formApontamentos!: FormGroup;
  ra_mat: string = '';
  ra_nome: string = '';
  z3_op: string = '';
  z3_oper: string = '';
  z3_descoper: string = '';
  z3_produto: string = ''
  z3_descpro: string = ''
  mensagem: string = '';
  operacoesDaOrdem: Array<any> = [];
  poServices: Array<any> = [];
  rework: string = 'NÃO';
  service: string = '';
  serviceDetails: string = ''
  isService: string = 'NÃo'
  serviceOk: boolean = false;


  dataInicioOperacao = ''
  horaInicioOperacao = ''

  opDesabilitada: string = "false";
  operacaoDesabilitada: boolean = false;
  DescricaoOperacaoDesabilitada: string = "true";


  isHideLoading: boolean = true;
  textLoadingOverlay: string = 'Aguarde'

  matriculaEmAtividade: boolean = false;

  ocultarImputOperacoes: boolean = true;
  ocultarComboOperacoes: boolean = false;


  constructor(private MatriculasService: MatriculasService,
    public poNotification: PoNotificationService,
    private router: Router,
    private ApontamentosService: ApontamentosService,
    private poDialog: PoDialogService
  ) {

  }


  title: string = 'Apontamentos';

  public menuItems: Array<PoMenuItem> = []; //Definido no OnInit()
  public actions: Array<PoPageAction> = []; //Definido no OnInit()


  changeTitle(menu: PoMenuItem) {
    this.title = menu.label;
  }
  rowActions = {
    beforeSave: this.onBeforeSave.bind(this),
    afterSave: this.onAfterSave.bind(this),
    beforeRemove: this.onBeforeRemove.bind(this),
    afterRemove: this.onAfterRemove.bind(this),
    beforeInsert: this.onBeforeInsert.bind(this)
  };

  columns = [

    { property: 'datainicial', label: 'Data Inicial', align: 'left', readonly: true, width: 120 },
    { property: 'horainicial', label: 'Hora Inicial', align: 'left', width: 120, required: false, readonly: true },
    { property: 'datafinal', label: 'Data Final', align: 'left', readonly: true, width: 120 },
    { property: 'horafinal', label: 'Hora Final', align: 'left', width: 120, required: false, readonly: true },
    { property: 'usuario', label: 'Usuario', width: 350, readonly: true },
    { property: 'operacao', label: 'Operacao', width: 100, required: false, readonly: true },

  ];


  data = [
    {
      datainicial: '//',
      horainicial: ':',
      datafinal: '//',
      horafinal: ':',
      usuario: '',
      operacao: ''
    },
  ];
  onBeforeSave(row: any, old: any) {
    return row.occupation !== 'Engineer';
  }

  onAfterSave(row: any) {
    // console.log('onAfterSave(new): ', row);
  }

  onBeforeRemove(row: any) {
    // console.log('onBeforeRemove: ', row);

    return true;
  }

  onAfterRemove(row: any) {
    // console.log('onAfterRemove: ', row);
  }

  onBeforeInsert(row: any) {
    // console.log('onBeforeInsert: ', row);

    return true;
  }


  /*
  Evento que controla a mudança
  de conteudo do input ra_mat
  */
  async matriculaChange() {

    console.log('matriculaChange');
    let matriculaDigitada = this.formApontamentos.value['formMatricula']



    let MatriculaEncontrada = this.Matriculas.matriculas.find((element) => {
      return Object.values(element)[0] === matriculaDigitada;
    })

    if (MatriculaEncontrada === undefined) {
      this.formApontamentos.patchValue({ formMatricula: '', formColaborador: '' });
      this.poNotification.error('Matrícula inválida para esta filial.');
    }
    else {

      //Se for digitado uma matricula válida

      //Atualiza o nome do colaborador:
      this.formApontamentos.patchValue({ formColaborador: Object.values(MatriculaEncontrada!)[1] });

      let filial = this.mrCodigoEmpresa

      //Faz requisição para serviço que tratará OP em aberto
      //pelo colaborador
      try {

        this.isHideLoading = false
        const response = await api.get(`minhasrotinas/statusmatricula?filial=${filial}&matricula=${matriculaDigitada}`);
        this.isHideLoading = true
        this.textLoadingOverlay = 'Aguarde';
        this.dataInicioOperacao = response?.data?.dataInicio;
        this.horaInicioOperacao = response?.data?.HoraInicio;
        this.isService = response?.data?.isService;
        if (response?.data?.ordem === '') {
          this.mensagem = ' '

          if (this.mrBloqueiaOP === 'sim') {
            this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
          }
          this.actions[this.actions.findIndex(item => item.label === 'Finalizar')].disabled = true;
          this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;
          this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = true;

          this.recno = 0;
          this.opDesabilitada = "false";
          this.operacaoDesabilitada = false;

          this.ocultarComboOperacoes = false;
          this.ocultarImputOperacoes = true;

          this.poNotification.setDefaultDuration(3000);
          this.poNotification.information('Nenhuma atividade iniciada para ' + this.formApontamentos.value['formColaborador']);
          this.matriculaEmAtividade = false;


        }
        else {
          this.opDesabilitada = "true";
          this.operacaoDesabilitada = true;
          this.mensagem = ' Atividade iniciada em ' + this.dataInicioOperacao + ' as ' + this.horaInicioOperacao;

          if (this.mrBloqueiaOP === 'sim') {
            this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
          }
          this.actions[this.actions.findIndex(item => item.label === 'Finalizar')].disabled = false;
          this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;

          if (this.isService === 'sim') {
            this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = false;


            this.servicesList = []
            const poServices = response?.data?.poServices;
            for (let i = 0; i < poServices.length; i++) {
              console.log(i);
              let code = poServices[i].code;
              let description = poServices[i].description;
              this.servicesList.push({ value: code, label: `${code} - ${description}` });

            }

          }
          else {
            this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = true;
          }


          this.recno = response?.data?.recnoZ3;
          this.matriculaEmAtividade = true;
          let operacao = response?.data?.operacao;
          let descricaoOperacao = response?.data.descricaoOperacao;
          this.listaDeOperacoes = [{ value: operacao, label: `${operacao} - ${descricaoOperacao}` }]
          this.ocultarComboOperacoes = true;
          this.ocultarImputOperacoes = false;

        }

        this.formApontamentos.patchValue({
          formNumeroOP: response?.data?.ordem,
          formOperacao: response?.data?.ListaDeOperacao,
          formDescOperacao: response?.data?.operacao + '-' + response?.data?.descricaoOperacao,
          formProduto: response?.data?.produto,
          formDescPro: response?.data?.descricaoProduto,
          formMensagem: this.mensagem

        }
        )
        this.z3_op = response?.data?.ordem
        this.z3_oper = response?.data?.operacao;
        this.z3_descoper = response?.data?.operacao + '-' + response?.data?.descricaoOperacao;
        this.z3_produto = response?.data?.produto;
        this.z3_descpro = response?.data?.descricaoProduto;

        this.data = []
        const apontamentos = response?.data?.apontamentos
        console.log(apontamentos);

        for (let i = 0; i < apontamentos.length; i++) {

          this.data.push(apontamentos[i]);

        }

        this.serviceOk = false;

      } catch (error) {
        //colocar tratativa de erro aqui.
      }









    }



  }


  async opChange() {

    if (this.matriculaEmAtividade === false) {

      this.z3_op = this.formApontamentos.value['formNumeroOP'];

      if (this.z3_op !== '') {
        //executada chamada a api para validar a OP informada
        //e trazer suas operações disponíveis

        try {

          this.z3_produto = '';
          this.z3_descpro = '';

          this.formApontamentos.patchValue({ formProduto: this.z3_produto, formDescPro: this.z3_descpro });


          this.isHideLoading = false
          const response = await api.get(`minhasrotinas/statusop?filial=${this.mrCodigoEmpresa}&ordem=${this.z3_op}`);
          this.isHideLoading = true
          this.textLoadingOverlay = 'Aguarde';

          if (response?.data?.encontrada !== 'sim') {
            this.poNotification.error('Ordem de produção não encontrada.');
            return;
          }

          //Permitir que mais de uma pessoa aponte para a mesma OP
          //05.02.2025

          // else if (response?.data?.emAtividade === 'sim') {
          //  this.poNotification.error('Essa ordem já está com uma atividade iniciada.');
          // return;
          // }
          else if (response?.data?.encerrada === 'sim') {
            this.poNotification.error('Essa ordem já está encerrada.');
            return;
          }
          else if (response?.data?.firme === 'não') {
            this.poNotification.error('Essa ordem não é uma ordem firme.');
            return;
          } else if (response?.data?.bloqueioRetrabalho === 'sim') {

            let opRetrabalho = response?.data?.opRetrabalho

            //Se o usuário for um apontador:
            if (this.mrApontador === 'sim') {
              this.poNotification.error(`OP em retrabalho. Apontar na OP: ${opRetrabalho}`);
              this.formApontamentos.patchValue({ formNumeroOP: opRetrabalho })
              this.opChange();
              return
            }
            else {
              //Se não, ele pode tirar o bloqueio da OP:
              this.actions[this.actions.findIndex(item => item.label === 'Finalizar')].disabled = true;
              this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;
              this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = true;
              if (this.mrBloqueiaOP === 'sim') {
                this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].label = 'Desbloquear';
                this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = false;
                this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].action = () => { this.poDialog.confirm({ title: 'Desbloquear OP', message: 'Deseja desbloquear a OP ?', confirm: () => { this.blockProduction() } }) };
              };
              this.mensagem = 'OP Bloqueada por retrabalho'
              this.formApontamentos.patchValue({ formMensagem: this.mensagem });
              this.z3_produto = response?.data?.produto;
              this.z3_descpro = response?.data?.descricaoProduto;

              this.formApontamentos.patchValue({ formProduto: this.z3_produto, formDescPro: this.z3_descpro });
              return
            }

          }

          //Check if the production order is for rework, then disable the lock button:
          if (response?.data?.isRework) {
            this.rework = 'SIM';
            this.formApontamentos.patchValue({ formRetrabalho: this.rework });
            if (this.mrApontador != 'sim') {
              this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
            }
          } else {
            this.rework = 'NÃO';
            this.formApontamentos.patchValue({ formRetrabalho: this.rework });
          }

          this.z3_produto = response?.data?.produto;
          this.z3_descpro = response?.data?.descricaoProduto;
          this.operacoesDaOrdem = response?.data?.operacoesDaOrdem;
          this.isService = response?.data?.isService;
          this.poServices = response?.data?.poServices;

          console.log(this.operacoesDaOrdem);
          //Carrega as operações da ordem nalista
          //04.02.2025
          this.listaDeOperacoes = []
          for (let i = 0; i < this.operacoesDaOrdem.length; i++) {
            console.log(i);
            let operacao = this.operacoesDaOrdem[i].operacao;
            let descricaoOperacao = this.operacoesDaOrdem[i].descricao;
            this.listaDeOperacoes.push({ value: operacao, label: `${operacao} - ${descricaoOperacao}` });

          }

          this.servicesList = []
          for (let i = 0; i < this.servicesList.length; i++) {
            console.log(i);
            let code = this.poServices[i].code;
            let description = this.poServices[i].description;
            this.servicesList.push({ value: code, label: `${code} - ${description}` });

          }

          this.formApontamentos.patchValue({ formProduto: this.z3_produto, formDescPro: this.z3_descpro, formOperacao: this.listaDeOperacoes, formDescOperacao: this.z3_descoper, });

          if (this.mrBloqueiaOP === 'sim' && response?.data?.isRework === false) {
            this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = false;
          }
          //this.actions[0].disabled = false;

          this.serviceOk = false;

        } catch (error) {

        }


        /*
         Retorno:
         {
           encontrada:"sim",
           emAtividade:"não",
           encerrada:"não",
           firme:"sim",
           descricaoProduto:"PRODUTO ACABADO",
           operacoesDaOrdem:
           [
            {codigo:"10",
            descricaoOperacao:"SOLDAGEM"},
            {codigo:"20",
            descricaoOperacao:"ISOLAMENTO TERMICO"
            }
           ]
         }
        */

      }

    }
  }


  operacaoChange() {

    const operacao = this.formApontamentos.value['formOperacao'];

    let operacaoEncontrada = this.operacoesDaOrdem.find((element) => {
      return Object.values(element)[0] === operacao;
    })

    if (operacaoEncontrada === undefined) {
      this.z3_descoper = ''

      if (this.mrBloqueiaOP === 'sim') {
        this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
      }
      this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;

      // this.actions[2].disabled = true;
      // this.actions[0].disabled = true;
      this.poNotification.error('Operação inválida para esta ordem de produção.');
    } else {
      if (this.mrBloqueiaOP === 'sim') {
        this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = false;
      }
      this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = false;


      // this.actions[2].disabled = false;
      // this.actions[0].disabled = false;
    }


  }

  opEnter() {

    this.z3_op = '';
    this.z3_oper = '';
    this.z3_descoper = '';
    this.z3_produto = '';
    this.z3_descpro = '';
    this.mensagem = '';
    this.rework = '';
    this.isService = 'NÃO';
    this.listaDeOperacoes = [];
    this.formApontamentos.patchValue({ formNumeroOP: this.z3_op, formOperacao: this.listaDeOperacoes, formDescOperacao: this.z3_descoper, formProduto: this.z3_produto, formDescPro: this.z3_descpro, formMensagem: this.mensagem, formRetrabalho: '' });
    // this.actions[2].disabled = true;
    // this.actions[0].disabled = true;

    if (this.mrBloqueiaOP === 'sim') {
      this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].label = 'Bloquear';
      this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
    }
    this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;


    this.serviceOk = false;

  };


  matriculaEnter() {

    //Reseta o valor das variáveis de controle
    this.ra_mat = '';
    this.ra_nome = '';
    this.z3_op = '';
    this.z3_oper = '';
    this.z3_descoper = '';
    this.z3_produto = '';
    this.z3_descpro = '';
    this.mensagem = '';
    this.listaDeOperacoes = [];
    this.service = '';
    this.serviceDetails = '';

    //Limpa o conteudo dos itens:
    this.data = [
      {
        datainicial: '//',
        horainicial: ':',
        datafinal: '//',
        horafinal: ':',
        usuario: '',
        operacao: ''
      },
    ];

    //reseta o formulário
    this.formApontamentos.reset();
    this.opDesabilitada = "false";
    this.operacaoDesabilitada = false;


    if (this.mrBloqueiaOP === 'sim') {
      this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].label = 'Bloquear';
      this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
    }
    this.actions[this.actions.findIndex(item => item.label === 'Finalizar')].disabled = true;
    this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;
    this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = true;


    this.ocultarComboOperacoes = false;
    this.ocultarImputOperacoes = true;

    this.serviceOk = false;


  }


  createForm() {
    this.formApontamentos = new FormGroup({
      formMatricula: new FormControl(this.ra_mat),
      formColaborador: new FormControl(this.ra_nome),
      formNumeroOP: new FormControl(this.z3_op),
      formOperacao: new FormControl(this.listaDeOperacoes),
      formDescOperacao: new FormControl(this.z3_descoper),
      formProduto: new FormControl(this.z3_produto),
      formDescPro: new FormControl(this.z3_descpro),
      formMensagem: new FormControl(this.mensagem),
      formRetrabalho: new FormControl(this.rework)

    });
  }

  ngOnInit(): void {

    this.mrCodigoEmpresa = sessionStorage.getItem('mrCodigoEmpresa');
    this.mrNomeEmpresa = sessionStorage.getItem('mrNomeEmpresa');
    this.mrDataBase = sessionStorage.getItem('mrDataBase');
    this.mrUsuario = sessionStorage.getItem('mrUsuario');
    this.mrApontador = sessionStorage.getItem('mrApontador');
    this.mrBloqueiaOP = sessionStorage.getItem('mrBloqueiaOP');



    this.mrTitulo = APP_VERSION + ' | ' + this.mrNomeEmpresa + ' | ' + this.mrDataBase + ' | ' + this.mrUsuario;
    console.log(this.mrTitulo);
    this.createForm();
    this.Matriculas = this.MatriculasService.buscaMatriculas();


    this.ApontamentosService.getMotivosRetrabalhos().subscribe(response => {
      console.log('getMotivosRetrabalhos()');
      console.log(response);
      this.listaRetrabalhos = response;
    });

    this.menuItems = [
      { label: this.mrApontador === 'sim' ? 'Logoff' : 'Menu', action: this.LogOff.bind(this), icon: 'fa-solid fa-door-open', shortLabel: 'Sair' },

    ];


    this.actions.push({ label: 'Finalizar', action: () => this.finalizarAtividade(), icon: 'ph ph-share', disabled: true });
    this.actions.push({ label: 'Iniciar', action: () => this.iniciarAtividade(), icon: 'ph ph-share', disabled: true });
    if (this.mrBloqueiaOP === 'sim') {
      this.actions.push({ label: 'Bloquear', action: () => this.pageSlide.open(), icon: 'ph ph-x-circle', disabled: true });
    }
    this.actions.push({ label: 'Serviços', action: () => this.Services(), icon: 'ph ph-share', disabled: true });


  }


  async iniciarAtividade() {

    //desabilita os botões
    // this.actions[0].disabled = true;
    // this.actions[1].disabled = true;
    // this.actions[2].disabled = true;

    if (this.mrBloqueiaOP === 'sim') {
      this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
    }
    this.actions[this.actions.findIndex(item => item.label === 'Finalizar')].disabled = true;
    this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;
    this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = true;

    const body = {
      filial: this.mrCodigoEmpresa,
      dataBase: this.mrDataBase,
      usuario: this.mrUsuario,
      acao: "iniciar",
      ordem: this.formApontamentos.value['formNumeroOP'],
      operacao: this.formApontamentos.value['formOperacao'],
      matricula: this.formApontamentos.value['formMatricula']
    }

    try {

      //Chamada para requisição do serviço de finalização de atividade
      this.isHideLoading = false;
      const response = await api.post(`minhasrotinas/atividades`, body);
      this.isHideLoading = true
      this.textLoadingOverlay = 'Aguarde';;
      this.poNotification.setDefaultDuration(4000);
      this.poNotification.success(response?.data?.message);

      this.matriculaEnter();

    } catch (error) {
      this.poNotification.error((error as any));
    }

  }

  async finalizarAtividade() {


    if (this.isService === 'sim' && this.serviceOk === false) {
      this.modalService.open();
      return
    }

    if (this.mrBloqueiaOP === 'sim') {
      this.actions[this.actions.findIndex(item => item.label === 'Bloquear' || item.label === 'Desbloquear')].disabled = true;
    }
    this.actions[this.actions.findIndex(item => item.label === 'Finalizar')].disabled = true;
    this.actions[this.actions.findIndex(item => item.label === 'Iniciar')].disabled = true;
    this.actions[this.actions.findIndex(item => item.label === 'Serviços')].disabled = true;


    const body = {
      filial: this.mrCodigoEmpresa,
      dataBase: this.mrDataBase,
      usuario: this.mrUsuario,
      acao: "finalizar",
      recno: this.recno,
      ordem: this.formApontamentos.value['formNumeroOP'],
      operacao: this.z3_oper,
      matricula: this.formApontamentos.value['formMatricula'],
      servico: this.service,
      detalhesServico: this.serviceDetails
    }

    try {

      //Chamada para requisição do serviço de finalização de atividade
      this.isHideLoading = false;
      const response = await api.post(`minhasrotinas/atividades`, body);
      this.isHideLoading = true;
      this.textLoadingOverlay = 'Aguarde';
      if (response?.data?.code === 500) {
        this.poNotification.error((response?.data?.message));
      } else {
        this.poNotification.setDefaultDuration(4000);
        this.poNotification.success(response?.data?.message);
      }

      this.matriculaEnter();

    } catch (error) {
      this.poNotification.error((error as any));
    }

  }

  async blockProduction() {

    let bloquear: boolean = this.actions.findIndex(item => item.label === 'Bloquear') >= 0

    console.log(bloquear);
    if (bloquear) {
      if (!this.motivoRetrabalho) {
        this.poNotification.warning('Informe o motivo do retrabalho.');
        return;
      }

      if (!this.opRetrabalho) {
        this.poNotification.warning('Informe a OP do retrabalho.');
        return;
      }

      if (!this.obsRetrabalho) {
        this.poNotification.warning('Informe a observação do retrabalho.');
        return;
      }


      let body = {

        filial: this.mrCodigoEmpresa,
        dataBase: this.mrDataBase,
        numeroOP: this.formApontamentos.value['formNumeroOP'],
        numeroOPRetrabalho: this.opRetrabalho,
        motivoRetrabalho: this.motivoRetrabalho,
        obsRetrabalho: this.obsRetrabalho

      }

      try {
        this.textLoadingOverlay = 'Bloqueando OP';
        this.isHideLoading = false;

        let response = await this.ApontamentosService.blockProduction(body);

        if (response.code === 200) {

          console.log('200')
          this.isHideLoading = true;
          this.textLoadingOverlay = 'Aguarde';
          this.poNotification.information(response.message);
          console.log(response.message);
          this.pageSlide.close();
          this.inputMatricula.focus();

        } else {

          console.log('nao é 200')
          this.isHideLoading = true;
          this.textLoadingOverlay = 'Aguarde';
          this.poNotification.error(response.message);


        }
      } catch (error) {

        this.isHideLoading = true;
        this.textLoadingOverlay = 'Aguarde';
        this.poNotification.error(`Erro :${error}`);

      }

    } else {     //unblock Production Order

      try {

        this.textLoadingOverlay = 'Desbloqueando OP';
        this.isHideLoading = false;

        let body = {

          branch: this.mrCodigoEmpresa,
          dataBase: this.mrDataBase,
          productionOrder: this.formApontamentos.value['formNumeroOP'],
        }

        let response = await this.ApontamentosService.unblockProduction(body);

        if (response.code === 200) {

          this.isHideLoading = true;
          this.textLoadingOverlay = 'Aguarde';
          this.poNotification.information(response.message);
          console.log(response.message);
          this.inputMatricula.focus();

        } else {
          this.isHideLoading = true;
          this.textLoadingOverlay = 'Aguarde';
          this.poNotification.error(response.message);

        }

      } catch (error: any) {
        this.isHideLoading = true;
        this.textLoadingOverlay = 'Aguarde';
        this.poNotification.error(error);
      }

    };

  };

  Services() {
    this.modalService.open();
  }

  serviceConfirm() {

    if (this.service === '') {
      this.poNotification.warning('Selecione o serviço na lista de opções.')
      return
    }

    if (this.serviceDetails === '') {
      this.poNotification.warning('Informe o detalhamento do serviço.')
      return
    }

    this.serviceOk = true;
    this.modalService.close()
    this.finalizarAtividade();
  }

  LogOff(menu: PoMenuPanelItem) {
    if (this.mrApontador === 'sim') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/menuproducao']);
    }
  }

}


