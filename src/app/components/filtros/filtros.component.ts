import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { Filter } from './interface';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

// abstrair é a arte que faz uma esponja o bob esponja

@Component({
  selector: 'app-filtros',
  template: require('./filtros.component.html'),
  styles: [require('./filtros.component.scss')]
})
export class FiltersComponent implements OnInit {

  @Input('ApiBase') ApiBase: string;
  @Input('filter') filter: any = {};
  @Input('searchDefaultValue') searchDefaultValue: any;
  @Input('id') id: string;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  isAlive: boolean = true;
  defaultFilterCount: number = 0;
  constructor(private http: HttpClient, private elRef: ElementRef, private zone: NgZone, private locationService: PlatformLocation) {
  }

  ngOnInit() {
    // Inicializar valor selected
    let values = this.filter.values ? 'values' : 'campos';

    // Inicia o processo de tratamento de filtros
    this.tratarFilter();
  }

  // Faz o tratamento dos filtros para exibição
  tratarFilter(): void {
    let filter = this.filter;
    let processId = 'filtros-tratarFiltro';

    filter.column = filter.column || filter.desc;

    // Caso já possua values, só verificar default direto
    if (filter.values) {
      this.verifyDefaultFilter(filter, processId);

    } else if (filter.valuesSource) {
      this.montarValores(filter, processId);
    }
  }

  // Montar values do filtro caso não tenha sido passado
  montarValores(filtrar, processId) {
    let filter = this.filter;
    let values = [];

    let url = (filter.valuesSource.urlPers) ? filter.valuesSource.url : this.ApiBase + filter.valuesSource.url;

    // Caso tenha parametros soltos
    if (filter.valuesSource.params) {
      url += '&' + this.filter.valuesSource.params;
    }

    // Caso tenha um campo de filter, começar com ele zerado
    if (filter.valuesSource.campoFiltro) {
      url += typeof filtrar === 'string' ? filtrar : `&filtro=[{}]`;
    }

    this.http
      .get(url)
      .takeWhile(() => this.isAlive)
      .subscribe(
      (response: any) => {

        filter.values = [];

        for (let res of response) {
          let valPesquisa: string = '';
          let valDescricao: string = '';

          valPesquisa = res[filter.valuesSource.campoValor];

          if (filter.valuesSource.campoDescricao) {
            if (typeof filter.valuesSource.campoDescricao === 'string') {
              valDescricao = res[filter.valuesSource.campoDescricao];
            } else {
              for (let item of filter.valuesSource.campoDescricao) {
                valDescricao += res[item] + ' ';
              }
            }
          }

          let data = {
            desc: valDescricao.trim() || valPesquisa.trim(),
            valor: valPesquisa.trim()
          };

          values.push(data);
        }

        filter.values = values;

        if (typeof filtrar !== 'string')
          filter.values.unshift({ desc: 'All', valor: '' });

        if (processId === 'filtros-tratarFiltro')
          this.verifyDefaultFilter(filter, processId);
      });
  }

  // Verifica e seleciona o valor padrão do filter, caso exista
  verifyDefaultFilter(filter: Filter, processId: any): void {

    let newSelected;

    if (filter.selecionadoSource) {
      let url = (filter.selecionadoSource.urlPers) ? filter.selecionadoSource.url : this.ApiBase + filter.selecionadoSource.url;

      if (filter.selecionadoSource.params) {
        url += '?' + filter.selecionadoSource.params;
      }

      this.http
        .get(url)
        .takeWhile(() => this.isAlive)
        .subscribe(
        response => {
          if (response) {
            let val: string = '';

            if (typeof filter.selecionadoSource.campoPesquisa === 'string') {
              val = response[filter.selecionadoSource.campoPesquisa];
            } else {
              for (let item of filter.selecionadoSource.campoPesquisa) {
                val += response[item] + ' ';
              }
            }

            filter.values.filter(item => {
              if (item.valor === val.trim()) {
                return this.selecionaFilter(filter, item, processId);
              }
            });
          }
        });

    } else {
      // Procurar por filtro default, caso nao tenha, será atribuido 'All'
      newSelected = filter.values.filter(item => item.default === true)[0];

    }

    this.verificacaoEspecifica(filter, newSelected, processId);

    this.selecionaFilter(filter, newSelected, processId);
  }

  selecionaFilter(filter, newSelected, processId) {

    // Quando é pesquisável e o valor for nulo
    if (!newSelected || (!newSelected.valor && !newSelected.desc)) {
      newSelected = {
        desc: 'All',
        valor: ''
      };
    }

    // Evita o recarregamento da tabela quando não há mudanças
    if (filter.selected && filter.selected.valor === newSelected.valor) {
      return;
    }

    this.callback.emit({ filter, newSelected });

    this.filter.selected = Object.assign({}, newSelected);
  }

  // Verificacao especifica para cada filter, se houver algum detalhe e etc
  verificacaoEspecifica(filter, newSelected, processId) {
    if (filter.type === 'pesquisavel' && newSelected) {
      //  Verificar se já há filtro salvo na column, caso tenha, pegar o valor e salvar novamente
      let valor = JSON.parse(sessionStorage.getItem(`/filtroPesquisavel-${filter.column}`));
      this.searchDefaultValue = (valor) ? valor : newSelected.valor;
      sessionStorage.setItem(`/filtroPesquisavel-${filter.column}`, JSON.stringify(this.searchDefaultValue));
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
