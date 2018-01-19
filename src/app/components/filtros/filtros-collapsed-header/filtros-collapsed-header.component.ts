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

      // Count the quantity of filters that have default values
      if (filter.values) {
        filter.values.map(valor => { if (valor.default) this.quantDefaultFilters++; });
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

    // Remove the old one, if it's there
    if (newSelected.antigo)
      delete this.filter_param[newSelected.antigo];

    // If there's no value, remove from the filters
    if (!newSelected.value) {
      delete this.filter_param[column];

      // If it's odata, just put the value
    } else if (filter.odata) {
      this.filter_param[column] = newSelected.value;

    } else if (newSelected.value) {
      this.filter_param[column] = `${column} ${newSelected.value}`;
    }

    if (this.orderBy) {
      orderBy = `&$orderby=${this.orderBy}`;
    }

    this.filter_url = `?$count=true&$top=${this.top || 0}&$skip=${this.skip || 0}${orderBy}&$filter=contains('', '') `;

    // Join all the filters in one string
    Object.keys(this.filter_param).forEach((value) => {
      this.filter_url += ' and ' + self.filter_param[value];
    });

    // Filter just if the default filters are over
    if (this.defaultFilterCount >= this.quantDefaultFilters)
      this.callback.emit({ filter_url: this.filter_url });
  }

  // Know the operator type that's going to be used and treat it
  tratarValor(filter: Filter, newSelected) {
    if (!newSelected.value)
      return newSelected;

    if (filter.operator === 'startswith') { }

    if (filter.operator === 'eq')
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
