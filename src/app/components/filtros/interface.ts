export interface Filter {
  desc: string; // Descrição da coleção de TDFiltros
  type?: string; // (Opcional, padrão: Select) select ou switch
  subtipo?: string; // Se houver um type específico, ex type: data, subtipo: mes
  label?: string; // True para exibir a label do filter (apenas em select)
  selected?: TDFiltrosValor; // Valor selected no filter
  selecionadoSource?: TDSource; // Source de dados da API para obter o selected
  column?: string; // (Opcional, se não informado utiliza desc) column que será filtrada com os valores informados
  values?: TDFiltrosValor[]; // Valores dos filtros (opções)
  valoresSource?: TDSource; // Source de dados da API para obter os valores
  collapsed?: boolean; // Caso o filter tenha que ser escondido em collapsed
  visible?: boolean; // Trocar a visibilidade do filter
  odata?: boolean; // Para filtros com uso de odata
  operator?: string; // Operador utilizado na funcao odata
}

export interface TDFiltrosValor {
  desc?: string; // (Opcional, se não informado utiliza valor) Descrição do valor
  valor: any; // Valor que filtrará o campo
  default?: boolean; // Define se o valor é o padrão
}

export interface TDSource {
  url?: string; // Método da API que carrega todos os dados
  urlPers?: boolean; // Caso a url seja manualmente definida
  campoPesquisa?: string[] | string; // Campo usado para o campo de pesquisa
  campoDescricao?: string[] | string; // Campo usado para a descrição da pesquisa (opcional)
  campoValor?: string[] | string; // Substituir 'campoPesquisa' aos poucos
  campoFiltro?: string[] | string; // Para filtros pesquisaveis, filtrar por esse campo
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Define o método de envio HTTP (GET, POST, PUT, DELETE)
  params?: string; // Parametros de URL
  paginacao?: number; // Número de itens para exibir por página (Padrão: 20)
  quantidadeUrl?: string;
  defaultTipo?: string;
}
