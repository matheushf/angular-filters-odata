import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Filter } from '../interface';

// cause you should never write something twice

@Component({
  selector: 'app-filters-collapsed',
  template: require('./filtros-collapsed-header.component.html'),
  styles: [require('./filtros-collapsed-header.component.scss')]
})
export class FiltrosCollapsedHeaderComponent implements OnInit {

  @Input('filtersObject') filtersObject: any = {};
  @Input('filtroPesquisavel') filtroPesquisavel: any;
  @Input('orderBy') orderBy: any;
  @Input('top') top: any;
  @Input('skip') skip: any;
  @Input('open') open: any;
  @Output('callbacklimparFiltros') callbacklimparFiltros: EventEmitter<any> = new EventEmitter();
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  filtro_param: Array<any> = [];
  filtro_url: string = '';
  quantFiltrosPadroes: number = 0;
  filtroPadraoCount: number = 0;

  constructor() {

  }

  ngOnInit() {
    let odata = (this.filtersObject.odata) ? true : false;

    this.filtersObject.filters.map((filter: Filter) => {
      // Caso seja odata, adicionar em todos
      filter.odata = odata;

      // Contar a quantidade de filtros que possuem valores padroes
      if (filter.valores) {
        filter.valores.map(valor => { if (value.default) this.quantFiltrosPadroes++; });
      } else if (filter.selecionadoSource) {
        this.quantFiltrosPadroes++;
      }
    });
  }

  selectFilter(filter: Filter, newSelected) {
    let self = this;
    let column = filter.column ? filter.column : filter.desc;
    let orderBy = '';
    this.filtroPadraoCount++;
    filtro = Object.assign({}, filtro);
    newSelected = Object.assign({}, newSelected);

    newSelected = this.tratarValor(filter, newSelected);

    // Remover o antigo, caso exista
    if (newSelected.antigo)
      delete this.filtro_param[newSelected.antigo];

    // Caso não tenha valor, remover dos filtros
    if (!newSelected.value) {
      delete this.filtro_param[column];

      // Se for odata, só colocar o valor
    } else if (filter.odata) {
      this.filtro_param[column] = newSelected.value;

    } else if (newSelected.value) {
      this.filtro_param[column] = `${column} ${newSelected.value}`;
    }

    if (this.orderBy) {
      orderBy = `&$orderby=${this.orderBy}`;
    }

    this.filtro_url = `?$count=true&$top=${this.top || 0}&$skip=${this.skip || 0}${orderBy}&$filter=contains('', '') `;

    // Juntar todos os filtros em uma string
    Object.keys(this.filtro_param).forEach((value) => {
      this.filtro_url += ' and ' + self.filtro_param[value];
    });

    // Filtrar apenas se os filtros padroes estiverem acabado
    if (this.filtroPadraoCount >= this.quantFiltrosPadroes)
      this.callback.emit({ filtro_url: this.filtro_url });
  }

  // Saber o type de operador que será usado e tratar de acordo
  tratarValor(filter: Filter, newSelected) {
    if (!newSelected.value)
      return newSelected;

    if (filter.operador === 'startswith')

      if (filter.operador === 'eq')
        newSelected.value = ` ${filter.column} eq ${newSelected.value} `;

    return newSelected;
  }

  identifyOperator(operator, filter, newSelected) {

    switch (operator) {
      case 'startswith':
        newSelected.value = ` startswith(${filter.column}, '${newSelected.value}') `;

    }

    return newSelected;
  }

  limparFiltros() {
    this.filtersObject.filtros.map(value => value.selected = { valor: '', desc: 'All' });
    this.callbacklimparFiltros.emit(true);
  }

}
