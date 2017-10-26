import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment';
declare var moment: any;

@Component({
  selector: 'filtro-data',
  template: require('./data.component.html'),
  styles: [require('./data.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')]
})
export class DataComponent implements OnInit {

  @Input('filter') filter: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  today = new Date();
  selecionado: string = '';
  meses: Array<any> = [];
  data_inicio: any;
  data_fim: any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.filter.subtipo === 'select') {
      this.dataSelect();
    }
  }

  // Fix para quando clicar no dateBox do Dx nao fechar o dropdown de filtros
  fixDropDownDx() {
    window.setTimeout(() => {
      $(document).find('.dx-datebox-wrapper').on('click', (event) => {
        event.stopImmediatePropagation();
      });
    }, 300);
  }

  // Formatar valores para aparecer no <select></select>
  dataSelect() {
    let quant = (this.filter.valores.length > 0) ? this.filter.valores[0].valor : 12;
    let format = (this.filter.valores.length > 0) ? this.filter.valores[0].desc : 'MM/YYYY';

    let date = moment();
    date.subtract(quant, 'months');

    for (let i = 0; i <= quant; i++) {
      date.add(1, 'months');
      this.meses.push(date.format(format));
    }
  }

  selecionarPersonalizado() {
    this.data_inicio = moment();
    this.data_fim = moment();
    this.selecionado = 'personalizado';
  }

  calcularData(data) {
    this.selecionado = data;

    this.data_fim = moment();

    switch (data) {
      case 'hoje':
        this.data_inicio = this.data_fim.subtract(1, 'days');
        break;

      case '7d':
        this.data_inicio = this.data_fim.subtract(7, 'days');
        break;

      case '1m':
        this.data_inicio = this.data_fim.subtract(1, 'months');
        break;
    }

    this.data_inicio = this.data_inicio.utc().format();

    this.selectFilter();
  }

  selectFilter() {
    let newSelected: any = {};
    let coluna = this.filter.coluna ? this.filter.coluna : this.filter.desc;

    this.data_fim = moment().utc().format();

    newSelected.desc = coluna;

    // Por enquanto é só odata, quando for normal pensar em como vai enviar
    if (this.filter.odata)
      newSelected.valor = ` ${coluna} gt ${this.data_inicio} and ${coluna} lt ${this.data_fim} `;

    this.callback.emit({ filter: this.filter, newSelected });
  }
}
