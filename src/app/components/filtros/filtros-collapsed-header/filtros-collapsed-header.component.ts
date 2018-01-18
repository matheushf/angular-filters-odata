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
  @Output('cleanFilters') cleanFilters: EventEmitter<any> = new EventEmitter();
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  filter_param: Array<any> = [];
  filter_url: string = '';
  quantDefaultFilters: number = 0;
  defaultFilterCount: number = 0;

  constructor() {

  }

  ngOnInit() {
    let odata = (this.filtersObject.odata) ? true : false;

    this.filtersObject.filters.map((filter: Filter) => {
      // If it's odata, add in all
      filter.odata = odata;

      // Contar a quantidade de filtros que possuem valores padroes
      // Count the quantity of filters that have default values
      if (filter.values) {
        filter.values.map(valor => { if (filter.default) this.quantDefaultFilters++; });
      } else if (filter.selecionadoSource) {
        this.quantDefaultFilters++;
      }
    });
  }

  selectFilter(filter: Filter, newSelected) {
    let self = this;
    let column = filter.column ? filter.column : filter.desc;
    let orderBy = '';
    this.defaultFilterCount++;
    filter = Object.assign({}, filter);
    newSelected = Object.assign({}, newSelected);

    newSelected = this.tratarValor(filter, newSelected);

    // Remover o antigo, caso exista
    if (newSelected.antigo)
      delete this.filter_param[newSelected.antigo];

    // Caso não tenha valor, remover dos filtros
    if (!newSelected.value) {
      delete this.filter_param[column];

      // Se for odata, só colocar o valor
    } else if (filter.odata) {
      this.filter_param[column] = newSelected.value;

    } else if (newSelected.value) {
      this.filter_param[column] = `${column} ${newSelected.value}`;
    }

    if (this.orderBy) {
      orderBy = `&$orderby=${this.orderBy}`;
    }

    this.filter_url = `?$count=true&$top=${this.top || 0}&$skip=${this.skip || 0}${orderBy}&$filter=contains('', '') `;

    // Juntar todos os filtros em uma string
    Object.keys(this.filter_param).forEach((value) => {
      this.filter_url += ' and ' + self.filter_param[value];
    });

    // Filtrar apenas se os filtros padroes estiverem acabado
    if (this.defaultFilterCount >= this.quantDefaultFilters)
      this.callback.emit({ filter_url: this.filter_url });
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
    this.cleanFilters.emit(true);
  }

}
