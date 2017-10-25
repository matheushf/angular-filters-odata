import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { Filtro } from './interface';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

// abstrair é a arte que faz uma esponja o bob esponja

@Component({
  selector: 'app-filtros',
  template: require('./filtros.component.html'),
  styles: [require('./filtros.component.scss'), require('../tabela-dinamica/tabela-dinamica.scss')]
})
export class FiltrosComponent implements OnInit {

  @Input('ApiBase') ApiBase: string;
  @Input('filter') filter: any = {};
  @Input('searchDefaultValue') searchDefaultValue: any;
  @Input('id') id: string;
  @Output('callback') callback: EventEmitter<any> = new EventEmitter();
  isAlive: boolean = true;
  filtroPadraoCount: number = 0;
  constructor(private http: HttpClient, private elRef: ElementRef, private zone: NgZone, private locationService: PlatformLocation) {
  }

  ngOnInit() {
    // Inicializar valor selecionado
    let valores = this.filter.valores ? 'valores' : 'campos';

    // Inicia o processo de tratamento de filtros
    this.tratarFiltro();
  }

  // Faz o tratamento dos filtros para exibição
  tratarFiltro(): void {
    let filtro = this.filter;
    let processoId = 'filtros-tratarFiltro';

    filtro.coluna = filtro.coluna || filtro.desc;

    // Caso já possua valores, só verificar padrao direto
    if (filtro.valores) {
      this.verificaFiltroPadrao(filtro, processoId);

    } else if (filtro.valoresSource) {
      this.montarValores(filtro, processoId);
    }
  }

  // Montar valores do filtro caso não tenha sido passado
  montarValores(filtrar, processoId) {
    let filtro = this.filter;
    let valores = [];

    let url = (filtro.valoresSource.urlPers) ? filtro.valoresSource.url : this.ApiBase + filtro.valoresSource.url;
    // Caso nao seja odata e precisar de take skip
    url += (filtro.valoresSource.takeSkip) ? '?take=50&skip=0' : '';

    // Caso tenha parametros soltos
    if (filtro.valoresSource.params) {
      url += '&' + this.filter.valoresSource.params;
    }

    // Caso tenha um campo de filtro, começar com ele zerado
    if (filtro.valoresSource.campoFiltro) {
      url += typeof filtrar === 'string' ? filtrar : `&filtro=[{}]`;
    }

    this.http
      .get(url)
      .takeWhile(() => this.isAlive)
      .subscribe(
      (response: any) => {

        filtro.valores = [];

        for (let res of response) {
          let valPesquisa: string = '';
          let valDescricao: string = '';

          // legacy code, em códigos recentes campoPesquisa no filtro foi mudado para campoValor
          if (filtro.valoresSource.campoPesquisa) {

            if (typeof filtro.valoresSource.campoPesquisa === 'string') {
              valPesquisa = res[filtro.valoresSource.campoPesquisa];
            } else {
              for (let item of filtro.valoresSource.campoPesquisa) {
                valPesquisa += res[item] + ' ';
              }
            }

          } else {
            valPesquisa = res[filtro.valoresSource.campoValor];
          }

          if (filtro.valoresSource.campoDescricao) {
            if (typeof filtro.valoresSource.campoDescricao === 'string') {
              valDescricao = res[filtro.valoresSource.campoDescricao];
            } else {
              for (let item of filtro.valoresSource.campoDescricao) {
                valDescricao += res[item] + ' ';
              }
            }
          }

          let data = {
            desc: valDescricao.trim() || valPesquisa.trim(),
            valor: valPesquisa.trim()
          };

          valores.push(data);
        }

        filtro.valores = valores;

        // tslint:disable-next-line:curly
        if (typeof filtrar !== 'string')
          filtro.valores.unshift({ desc: 'Todos', valor: '' });

        if (processoId === 'filtros-tratarFiltro')
          this.verificaFiltroPadrao(filtro, processoId);
      });
  }

  // Verifica e seleciona o valor padrão do filtro, caso exista
  verificaFiltroPadrao(filtro: Filtro, processoId: any): void {

    let novoSelecionado;
    let filtroStorage = JSON.parse(sessionStorage.getItem('/' + this.id + filtro.coluna));

    if (filtroStorage && filtroStorage.desc !== 'Todos') {
      novoSelecionado = filtroStorage;

    } else if (filtro.selecionadoSource) {
      let url = (filtro.selecionadoSource.urlPers) ? filtro.selecionadoSource.url : this.ApiBase + filtro.selecionadoSource.url;

      if (filtro.selecionadoSource.params) {
        url += '?' + filtro.selecionadoSource.params;
      }

      this.http
        .get(url)
        .takeWhile(() => this.isAlive)
        .subscribe(
        response => {
          if (response) {
            let val: string = '';

            if (typeof filtro.selecionadoSource.campoPesquisa === 'string') {
              val = response[filtro.selecionadoSource.campoPesquisa];
            } else {
              for (let item of filtro.selecionadoSource.campoPesquisa) {
                val += response[item] + ' ';
              }
            }

            filtro.valores.filter(item => {
              if (item.valor === val.trim()) {
                return this.selecionaFiltro(filtro, item, processoId);
              }
            });
          }
        });

    } else {
      // Procurar por filtro padrao, caso nao tenha, será atribuido 'Todos'
      novoSelecionado = filtro.valores.filter(item => item.padrao === true)[0];

    }

    this.verificacaoEspecifica(filtro, novoSelecionado, processoId);

    this.selecionaFiltro(filtro, novoSelecionado, processoId);
  }

  selecionaFiltro(filtro, novoSelecionado, processoId) {

    // Quando é pesquisável e o valor for nulo
    if (!novoSelecionado || (!novoSelecionado.valor && !novoSelecionado.desc)) {
      novoSelecionado = {
        desc: 'Todos',
        valor: ''
      };
    }

    // Evita o recarregamento da tabela quando não há mudanças
    if (filtro.selecionado && filtro.selecionado.valor === novoSelecionado.valor) {
      return;
    }

    this.callback.emit({ filtro, novoSelecionado });

    this.filter.selecionado = Object.assign({}, novoSelecionado);
  }

  // Verificacao especifica para cada filtro, se houver algum detalhe e etc
  verificacaoEspecifica(filtro, novoSelecionado, processoId) {
    if (filtro.tipo === 'pesquisavel' && novoSelecionado) {
      //  Verificar se já há filtro salvo na coluna, caso tenha, pegar o valor e salvar novamente
      let valor = JSON.parse(sessionStorage.getItem(`/filtroPesquisavel-${filtro.coluna}`));
      this.searchDefaultValue = (valor) ? valor : novoSelecionado.valor;
      sessionStorage.setItem(`/filtroPesquisavel-${filtro.coluna}`, JSON.stringify(this.searchDefaultValue));
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
