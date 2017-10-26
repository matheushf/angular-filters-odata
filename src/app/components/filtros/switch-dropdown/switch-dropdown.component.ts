import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtro-switch-dropdown',
  template: require('./switch-dropdown.component.html'),
  styles: [require('./switch-dropdown.component.scss')],
})
export class SwitchDropdownComponent implements OnInit {

  @Input('filter') filtroTemp: any = {};
  filter: any = {};
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.filter = this.filtroTemp;
  }

  selectFilter(filter, newSelected) {
    this.callback.emit({ filter, newSelected });
  }

}
