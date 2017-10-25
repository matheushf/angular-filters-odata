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
      tipo: 'switch',
      valores: [
        {
          desc: 'Ativo',
          valor: 'A',
          padrao: true
        },
        {
          desc: 'Inativo',
          valor: 'I'
        }
      ]
    }, {
      desc: 'Situacao',
      tipo: 'switch',
      collapsed: true,
      valores: [
        {
          desc: 'Boletos Abertos',
          valor: 'A'
        }
      ]
    }, {
      desc: 'Situacao',
      tipo: 'switch',
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
      coluna: 'TipoPessoa',
      tipo: 'switch-dropdown',
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
      tipo: 'switch-dropdown',
      valores: [
        {
          desc: 'Ativo',
          valor: `eq 'A'`,
          padrao: true,
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
      tipo: 'switch',
      valores: [
        {
          desc: 'Ativo',
          valor: ` Situacao eq 'A' `,
          // padrao: true
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
      tipo: 'data',
    },
    /*  Pesquisavel */
    {
      desc: 'Cliente',
      coluna: 'PessoaId',
      tipo: 'pesquisavel',
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
      tipo: 'pesquisavel',
      subtipo: 'input',
      campos: [{
        desc: 'Nome',
        coluna: 'PrimeiroNome',
        padrao: true
      }, {
        desc: 'Email',
        coluna: 'Email'
      }, {
        desc: 'Cpf',
        coluna: 'Cpf'
      }]
    },
    {
      desc: 'Cliente',
      coluna: 'PessoaId',
      tipo: 'pesquisavel',
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
      coluna: 'Estado',
      tipo: 'select',
      valores: ['GO', 'BA', 'PA']
    }
  ],
  callbacks: []
};
