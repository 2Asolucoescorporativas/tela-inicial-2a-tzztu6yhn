routerAdd('POST', '/backend/v1/cadastro/consultar-cpf', (e) => {
  var body = e.requestInfo().body || {}
  var cpf = String(body.cpf || '').replace(/\D/g, '')

  if (cpf.length !== 11) {
    return e.json(400, {
      success: false,
      error: 'cpf_invalido',
      message: 'Informe um CPF válido.',
    })
  }

  var cadastros = []

  if (cpf === '11111111111') {
    cadastros.push({
      nome: 'ANTÔNIO CARLOS RIBEIRO',
      cpf: cpf,
      inscricao_estadual: '9020829380',
      situacao_ie: 'Habilitado',
      tipo_ie: 'Produtor Rural',
      municipio: 'CURITIBA',
      codigo_ibge: '4106902',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
    })
  } else if (cpf === '22222222222') {
    cadastros.push({
      nome: 'MARIA JOSÉ FERREIRA',
      cpf: cpf,
      inscricao_estadual: '9031738401',
      situacao_ie: 'Habilitado',
      tipo_ie: 'Produtor Rural',
      municipio: 'CURITIBA',
      codigo_ibge: '4106902',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
    })
    cadastros.push({
      nome: 'MARIA JOSÉ FERREIRA',
      cpf: cpf,
      inscricao_estadual: '9042847512',
      situacao_ie: 'Habilitado',
      tipo_ie: 'Produtor Rural',
      municipio: 'PONTA GROSSA',
      codigo_ibge: '4119905',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
    })
  } else if (cpf === '33333333333') {
    // Scenario 3: no cadastros
  } else if (cpf === '44444444444') {
    cadastros.push({
      nome: 'PEDRO ALVES SOUZA',
      cpf: cpf,
      inscricao_estadual: '9053958623',
      situacao_ie: 'Baixada',
      tipo_ie: 'Produtor Rural',
      municipio: 'GUARAPUAVA',
      codigo_ibge: '4109401',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
    })
  } else if (cpf === '55555555555') {
    cadastros.push({
      nome: 'LUCIANA PEREIRA LIMA',
      cpf: cpf,
      inscricao_estadual: '9065069734',
      situacao_ie: 'Suspensa',
      tipo_ie: 'Produtor Rural',
      municipio: 'CASCAVEL',
      codigo_ibge: '4104808',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
    })
  } else {
    cadastros.push({
      nome: 'JOÃO TESTE DA SILVA',
      cpf: cpf,
      inscricao_estadual: '0000000000',
      situacao_ie: 'Habilitado',
      tipo_ie: 'Produtor Rural',
      municipio: 'CURITIBA',
      codigo_ibge: '4106902',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
    })
  }

  return e.json(200, {
    success: true,
    environment: 'mock',
    source: 'MOCK',
    quantidade: cadastros.length,
    cadastros: cadastros,
  })
})
