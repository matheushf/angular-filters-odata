import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var moment: any;

@Component({
  selector: 'app-filter-data',
  template: require('./data.component.html'),
  styles: [require('./data.component.scss')]
})
export class DataComponent implements OnInit {

  @Input('filter') filter: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  today = new Date();
  selected: string = '';
  months: Array<any> = [];
  date_start: any;
  date_end: any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.filter.subtipo === 'select') {
      this.dataSelect();
    }
  }

  // Fix for when clicking on DX DateBox it doesn't close the dropdown
  fixDropDownDx() {
    window.setTimeout(() => {
      $(document).find('.dx-datebox-wrapper').on('click', (event) => {
        event.stopImmediatePropagation();
      });
    }, 300);
  }

  // Format values to show on <select></select>
  dataSelect() {
    let quant = (this.filter.values.length > 0) ? this.filter.values[0].value : 12;
    let format = (this.filter.values.length > 0) ? this.filter.values[0].desc : 'MM/YYYY';

    let date = moment();
    date.subtract(quant, 'months');

    for (let i = 0; i <= quant; i++) {
      date.add(1, 'months');
      this.months.push(date.format(format));
    }
  }

  selectCustom() {
    this.date_start = moment();
    this.date_end = moment();
    this.selected = 'custom';
  }

  calcDate(data) {
    this.selected = data;

    this.date_end = moment();

    switch (data) {
      case 'today':
        this.date_start = this.date_end.subtract(1, 'days');
        break;

      case '7d':
        this.date_start = this.date_end.subtract(7, 'days');
        break;

      case '1m':
        this.date_start = this.date_end.subtract(1, 'months');
        break;
    }

    this.date_start = this.date_start.utc().format();

    this.selectFilter();
  }

  selectFilter() {
    let newSelected: any = {};
    let column = this.filter.column ? this.filter.column : this.filter.desc;

    this.date_end = moment().utc().format();

    newSelected.desc = column;

    if (this.filter.odata)
      newSelected.value = ` ${column} gt ${this.date_start} and ${column} lt ${this.date_end} `;

    this.callback.emit({ filter: this.filter, newSelected });
  }
}
