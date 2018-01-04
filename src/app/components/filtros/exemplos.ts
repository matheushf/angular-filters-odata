/* Exemplos de JSON para ser utilizados nos filtros */

let config = {
  id: 'todosClientes',
  source: {
    url: '/Pessoas/ObterTodos',
    campoPesquisa: ['PrimeiroNome', 'Sobrenome'],
    metodo: 'GET',
    params: 'tipoCadastro=C',
    quantidadeUrl: '/Pessoas/ObterQuantidadeCliente'
  },
  filtros: [
    /* Switch */
    {
      desc: 'Situacao',
      type: 'switch',
      valores: [
        {
          desc: 'Ativo',
          valor: 'A',
          default: true
        },
        {
          desc: 'Inativo',
          valor: 'I'
        }
      ]
    }, {
      desc: 'Situacao',
      type: 'switch',
      collapsed: true,
      valores: [
        {
          desc: 'Boletos Abertos',
          valor: 'A'
        }
      ]
    }, {
      desc: 'Situacao',
      type: 'switch',
      collapsed: true,
      valores: [
        {
          desc: 'Expirando hoje',
          valor: 'A'
        }
      ]
    },
    /* Switch Dropdown */
    {
      desc: 'Tipo Cliente',
      column: 'TipoPessoa',
      type: 'switch-dropdown',
      collapsed: true,
      valores: [
        {
          desc: 'Cliente',
          valor: 'C'
        },
        {
          desc: 'Usuário',
          valor: 'U'
        },
        {
          desc: 'Visitante',
          valor: 'V'
        }
      ]
    }, {
      desc: 'Situacao',
      type: 'switch-dropdown',
      valores: [
        {
          desc: 'Ativo',
          valor: `eq 'A'`,
          default: true,
        },
        {
          desc: 'Inativo',
          valor: `eq 'I'`,
        }
      ]
    },

    /* Switch odata */
    {
      desc: 'Situacao',
      type: 'switch',
      valores: [
        {
          desc: 'Ativo',
          valor: ` Situacao eq 'A' `,
          // default: true
        },
        {
          desc: 'Suspensa',
          valor: ` Situacao eq 'S' `
        },
        {
          desc: 'Aberto ou pendente',
          valor: ` (Status eq 'Aberto' or Status eq 'Pendente') `,
        }
      ]
    },

    /* Data (odata) */
    {
      desc: 'DataVencimento',
      label: 'Data Vencimento',
      type: 'data',
    },
    /*  Pesquisavel */
    {
      desc: 'Cliente',
      column: 'PessoaId',
      type: 'pesquisavel',
      subtipo: 'select-input',
      valoresSource: {
        url: '/Pessoas/ObterTodos',
        campoFiltro: 'PrimeiroNome',
        campoDescricao: ['PrimeiroNome', 'Sobrenome'],
        campoValor: 'PessoaId',
        metodo: 'GET',
        params: 'tipoCadastro=C',
      }
    },
    /* Pesquisavel (odata) */
    {
      desc: 'Pesquisa',
      type: 'pesquisavel',
      subtipo: 'input',
      campos: [{
        desc: 'Nome',
        column: 'PrimeiroNome',
        default: true
      }, {
        desc: 'Email',
        column: 'Email'
      }, {
        desc: 'Cpf',
        column: 'Cpf'
      }]
    },
    {
      desc: 'Cliente',
      column: 'PessoaId',
      type: 'pesquisavel',
      subtipo: 'select-input',
      operador: 'eq',
      // collapsed: true,
      valoresSource: {
        url: '/Pessoas/ObterTodos',
        campoFiltro: 'PrimeiroNome',
        campoDescricao: ['PrimeiroNome', 'Sobrenome'],
        campoValor: 'PessoaId',
        metodo: 'GET',
        params: 'tipoCadastro=C',
        takeSkip: true
      }
    },
    /* Select odata */
    {
      desc: 'Teste Select',
      column: 'Estado',
      type: 'select',
      valores: ['GO', 'BA', 'PA']
    }
  ],
  callbacks: []
};
