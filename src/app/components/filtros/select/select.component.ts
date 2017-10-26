import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filtro-select',
  template: require('./select.component.html'),
  styles: [require('./select.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')]
})
export class SelectComponent implements OnInit {

  @Input('filter') filter: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    // Montar o valor, caso tenha passado apenas um array sem objetos
    this.filter.valores.map((valor, index) => {
      if (!valor.desc) {
        this.filter.valores[index] = {
          desc: valor,
          valor: valor
        };
      }
    });
  }

  selectFilter(filter, newSelected) {

    newSelected = {
      desc: newSelected,
      valor: newSelected
    };

    if (filtro.odata) {
      newSelected.valor = ` ${filtro.coluna} eq '${newSelected.valor}' `;
    }

    this.callback.emit({ filter, newSelected });
  }

}
