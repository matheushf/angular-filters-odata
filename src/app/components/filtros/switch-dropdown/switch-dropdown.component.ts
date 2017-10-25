import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filtro-switch-dropdown',
  template: require('./switch-dropdown.component.html'),
  styles: [require('./switch-dropdown.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')],
})
export class SwitchDropdownComponent implements OnInit {

  @Input('filtro') filtroTemp: any = {};
  filtro: any = {};
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.filtro = this.filtroTemp;
  }

  selecionaFiltro(filtro, novoSelecionado) {
    this.callback.emit({filtro, novoSelecionado});
  }

}
