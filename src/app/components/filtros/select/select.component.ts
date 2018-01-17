import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtro-select',
  template: require('./select.component.html'),
  styles: [require('./select.component.scss')]
})
export class SelectComponent implements OnInit {

  @Input('filter') filter: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    // Montar o valor, caso tenha passado apenas um array sem objetos
    this.filter.values.map((valor, index) => {
      if (!value.desc) {
        this.filter.values[index] = {
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

    if (filter.odata) {
      newSelected.value = ` ${filter.column} eq '${newSelected.value}' `;
    }

    this.callback.emit({ filter, newSelected });
  }

}
