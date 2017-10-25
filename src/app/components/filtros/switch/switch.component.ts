import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filtro-switch',
  template: require('./switch.component.html'),
  styles: [require('./switch.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')],
})
export class SwitchComponent implements OnInit {

  @Input('filtro') filtro: any = {};
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  selecionaFiltro(filtro, novoSelecionado) {
    this.callback.emit({ filtro, novoSelecionado });
  }

}
