import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filtro-switch',
  template: require('./switch.component.html'),
  styles: [require('./switch.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')],
})
export class SwitchComponent implements OnInit {

  @Input('filter') filter: any = {};
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  selectFilter(filter, newSelected) {
    this.callback.emit({ filter, newSelected });
  }

}
