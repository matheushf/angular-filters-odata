import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filtro-pesquisavel',
  template: require('./pesquisavel.component.html'),
  styles: [require('./pesquisavel.component.scss')]
})
export class PesquisavelComponent implements OnInit, OnChanges {

  @Input('filter') filter: any;
  @Input('valorPadrao') valorPadrao: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  @Output('callbackMontarValores') callbackMontarValores: EventEmitter<any> = new EventEmitter();
  pesquisaTimeout: any;
  valorPesquisa: string = '';
  pesquisavelValor: any = '';
  column: string;
  label: string;
  isAlive: boolean = true;
  carregandoValores: boolean = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.label = (this.filter.campos && this.filter.campos[0].desc) ? this.filter.campos[0].desc : null;
    this.filter.values = (this.filter.values) ? this.filter.values : [];
  }

  ngAfterViewInit() {
    let filtro = this.filter;

    // Se for input, não precisa de tratamento nem nada
    if (filter.subtipo === 'input')
      return;
  }

  /* Quando o subtipo fori 'input' (não é dx), apenas pesquisar após o timeout */
  onPesquisa(valor) {

    clearTimeout(this.pesquisaTimeout);

    this.pesquisaTimeout = setTimeout(() => {

      let newSelected = {
        valor: valor,
        desc: this.filter.desc
      };

      this.selectFilter(this.filter, newSelected);
    }, 600);
  }

  // Ao mudar o campo da pesquisa (subtipo == 'input')
  selecionarCampo(column) {
    this.column = column;
    this.selectFilter(this.filter, {
      valor: $('#search-box').val(),
      desc: this.filter.desc
    });
  }

  // Para o dx, quando for pesquisar entre os valores do select
  filtrarPesquisa(event) {

    // Caso não seja uma letra, não filtrar
    if ((event.jQueryEvent.keyCode < 65 || event.jQueryEvent.keyCode > 90) && event.jQueryEvent.keyCode !== 8)
      return;

    let timer = 600;
    let source = this.filter.valoresSource;
    let valorPesquisa = event.jQueryEvent.target.value;

    if (!valorPesquisa)
      timer = 0;

    clearTimeout(this.pesquisaTimeout);

    this.pesquisaTimeout = setTimeout(() => {
      if (source.campoFiltro) {
        // @todo diferenciar se a busca é odata ou ObterTodos normal
        let filtrar = `&filtro=[{"Desc": "${source.campoFiltro}", "Coluna": "${source.campoFiltro}", "Valor": "${valorPesquisa}"}]`;
        this.callbackMontarValores.emit({ filter: filtrar, processId: 'pesquisavel-filtrarPesquisa' });
      }

    }, timer);
  }

  selectFilter(filter, newSelected) {
    if (this.valorPadrao)
      sessionStorage.setItem(`/filtroPesquisavel-${filter.column}`, JSON.stringify(newSelected.valor));

    newSelected.antigo = this.filter.column;

    // Caso tenha campo selected, atribuir a column do filtro
    if (this.column)
      this.filter.column = this.column;

    this.callback.emit({
      filter,
      newSelected
    });
  }
}
