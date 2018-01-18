import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter-pesquisavel',
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
    let filter = this.filter;

    // If it's 'input', don't need to do anything
    if (filter.subtipo === 'input')
      return;
  }

  // When the subtype is equal to 'input' (it isn't dx), just serarch after the timeout
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
  // When subtype == 'input'
  selecionarCampo(column) {
    this.column = column;
    this.selectFilter(this.filter, {
      valor: $('#search-box').val(),
      desc: this.filter.desc
    });
  }

  // For dx, when it's going to search between the select values 
  filtrarPesquisa(event) {

    // If it isn't a letter, dont filter
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
        let filtrar = `&filter=[{"Desc": "${source.campoFiltro}", "Coluna": "${source.campoFiltro}", "Valor": "${valorPesquisa}"}]`;
        this.callbackMontarValores.emit({ filter: filtrar, processId: 'pesquisavel-filtrarPesquisa' });
      }

    }, timer);
  }

  selectFilter(filter, newSelected) {
    if (this.valorPadrao)
      sessionStorage.setItem(`/filtroPesquisavel-${filter.column}`, JSON.stringify(newSelected.value));

    newSelected.antigo = this.filter.column;

    // If there's the selected field, assing to column filter
    if (this.column)
      this.filter.column = this.column;

    this.callback.emit({
      filter,
      newSelected
    });
  }
}
