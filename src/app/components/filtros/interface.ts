export interface Filter {
  desc: string; // Descrição da coleção de TDFiltros
  tipo?: string; // (Opcional, padrão: Select) select ou switch
  subtipo?: string; // Se houver um tipo específico, ex tipo: data, subtipo: mes
  label?: string; // True para exibir a label do filtro (apenas em select)
  selecionado?: TDFiltrosValor; // Valor selecionado no filtro
  selecionadoSource?: TDSource; // Source de dados da API para obter o selecionado
  column?: string; // (Opcional, se não informado utiliza desc) column que será filtrada com os valores informados
  valores?: TDFiltrosValor[]; // Valores dos filtros (opções)
  valoresSource?: TDSource; // Source de dados da API para obter os valores
  collapsed?: boolean; // Caso o filtro tenha que ser escondido em collapsed
  visivel?: boolean; // Trocar a visibilidade do filtro
  odata?: boolean; // Para filtros com uso de odata
  operador?: string; // Operador utilizado na funcao odata
}

export interface TDFiltrosValor {
  desc?: string; // (Opcional, se não informado utiliza valor) Descrição do valor
  valor: any; // Valor que filtrará o campo
  padrao?: boolean; // Define se o valor é o padrão
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
  padraoTipo?: string;
}
