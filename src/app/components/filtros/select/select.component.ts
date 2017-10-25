import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filtro-select',
  template: require('./select.component.html'),
  styles: [require('./select.component.scss'), require('../../tabela-dinamica/tabela-dinamica.scss')]
})
export class SelectComponent implements OnInit {

  @Input('filtro') filtro: any;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    // Montar o valor, caso tenha passado apenas um array sem objetos
    this.filtro.valores.map((valor, index) => {
      if (!valor.desc) {
        this.filtro.valores[index] = {
          desc: valor,
          valor: valor
        };
      }
    });
  }

  selecionaFiltro(filtro, novoSelecionado) {

    novoSelecionado = {
      desc: novoSelecionado,
      valor: novoSelecionado
    };

    if (filtro.odata) {
      novoSelecionado.valor = ` ${filtro.coluna} eq '${novoSelecionado.valor}' `;
    }

    this.callback.emit({ filtro, novoSelecionado });
  }

}
