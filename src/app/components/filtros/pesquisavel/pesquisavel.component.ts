import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBase } from '../../../services/login.service';

@Component({
  selector: 'filtro-pesquisavel',
  template: require('./pesquisavel.component.html'),
  styles: [require('./pesquisavel.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')]
})
export class PesquisavelComponent implements OnInit, OnChanges {

  @Input('filtro') filtro: any;
  @Input('valorPadrao') valorPadrao: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  @Output('callbackMontarValores') callbackMontarValores: EventEmitter<any> = new EventEmitter();
  pesquisaTimeout: any;
  valorPesquisa: string = '';
  pesquisavelValor: any = '';
  coluna: string;
  label: string;
  isAlive: boolean = true;
  carregandoValores: boolean = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.label = (this.filtro.campos && this.filtro.campos[0].desc) ? this.filtro.campos[0].desc : null;
    this.filtro.valores = (this.filtro.valores) ? this.filtro.valores : [];
  }

  ngAfterViewInit() {
    let filtro = this.filtro;

    // Se for input, não precisa de tratamento nem nada
    if (filtro.subtipo === 'input')
      return;
  }

  /* Quando o subtipo fori 'input' (não é dx), apenas pesquisar após o timeout */
  onPesquisa(valor) {

    clearTimeout(this.pesquisaTimeout);

    this.pesquisaTimeout = setTimeout(() => {

      let novoSelecionado = {
        valor: valor,
        desc: this.filtro.desc
      };

      this.selecionaFiltro(this.filtro, novoSelecionado);
    }, 600);
  }

  // Ao mudar o campo da pesquisa (subtipo == 'input')
  selecionarCampo(coluna) {
    this.coluna = coluna;
    this.selecionaFiltro(this.filtro, {
      valor: $("#search-box").val(),
      desc: this.filtro.desc
    });
  }

  // Para o dx, quando for pesquisar entre os valores do select
  filtrarPesquisa(event) {

    // Caso não seja uma letra, não filtrar
    if ((event.jQueryEvent.keyCode < 65 || event.jQueryEvent.keyCode > 90) && event.jQueryEvent.keyCode !== 8)
      return;

    let timer = 600;
    let source = this.filtro.valoresSource;
    let valorPesquisa = event.jQueryEvent.target.value;

    if (!valorPesquisa)
      timer = 0;

    clearTimeout(this.pesquisaTimeout);

    this.pesquisaTimeout = setTimeout(() => {
      if (source.campoFiltro) {
        // @todo diferenciar se a busca é odata ou ObterTodos normal
        let filtrar = `&filtro=[{"Desc": "${source.campoFiltro}", "Coluna": "${source.campoFiltro}", "Valor": "${valorPesquisa}"}]`;
        this.callbackMontarValores.emit({ filtro: filtrar, processoId: 'pesquisavel-filtrarPesquisa' });
      }

    }, timer);
  }

  selecionaFiltro(filtro, novoSelecionado) {
    if (this.valorPadrao)
      sessionStorage.setItem(`/filtroPesquisavel-${filtro.coluna}`, JSON.stringify(novoSelecionado.valor));

    novoSelecionado.antigo = this.filtro.coluna;

    // Caso tenha campo selecionado, atribuir a coluna do filtro
    if (this.coluna)
      this.filtro.coluna = this.coluna;

    this.callback.emit({
      filtro,
      novoSelecionado
    });
  }
}
