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

  try {
    $app.findFirstRecordByFilter(
      '_pb_users_auth_',
      "cpf = '" + cpf + "' && cadastro_concluido = true",
    )
    return e.json(200, {
      success: false,
      ja_cadastrado: true,
      message: 'Este CPF já possui cadastro no 2A Rural.',
    })
  } catch (_) {}

  var cadastros = []

  if (cpf === '11111111111') {
    cadastros.push({
      nome: 'ANTÔNIO CARLOS RIBEIRO',
      cpf: cpf,
      inscricao_estadual: '9020829380',
      situacao_ie: 'Habilitado',
      tipo_ie: 'IE de Produtor Rural',
      municipio: 'CURITIBA',
      codigo_ibge: '4106902',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
      endereco: 'RUA DAS FLORES, 123 - CENTRO',
    })
  } else if (cpf === '22222222222') {
    cadastros.push({
      nome: 'MARIA JOSÉ FERREIRA',
      cpf: cpf,
      inscricao_estadual: '9031738401',
      situacao_ie: 'Habilitado',
      tipo_ie: 'IE de Produtor Rural',
      municipio: 'CURITIBA',
      codigo_ibge: '4106902',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
      endereco: 'AV. VISCONDE DE TAUNAY, 456 - CENTRO',
    })
    cadastros.push({
      nome: 'MARIA JOSÉ FERREIRA',
      cpf: cpf,
      inscricao_estadual: '9042847512',
      situacao_ie: 'Habilitado',
      tipo_ie: 'IE de Produtor Rural',
      municipio: 'PONTA GROSSA',
      codigo_ibge: '4119905',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
      endereco: 'RUA MARECHAL, 789 - CENTRO',
    })
  } else if (cpf === '33333333333') {
  } else if (cpf === '44444444444') {
    cadastros.push({
      nome: 'PEDRO ALVES SOUZA',
      cpf: cpf,
      inscricao_estadual: '9053958623',
      situacao_ie: 'Habilitado',
      tipo_ie: 'IE Normal',
      municipio: 'GUARAPUAVA',
      codigo_ibge: '4109401',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
      endereco: 'RUA PADRE SALDANHA, 789 - CENTRO',
    })
  } else if (cpf === '55555555555') {
    cadastros.push({
      nome: 'LUCIANA PEREIRA LIMA',
      cpf: cpf,
      inscricao_estadual: '9065069734',
      situacao_ie: 'Suspensa',
      tipo_ie: 'IE de Produtor Rural',
      municipio: 'CASCAVEL',
      codigo_ibge: '4104808',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
      endereco: 'AV. BRASIL, 321 - CENTRO',
    })
  } else {
    cadastros.push({
      nome: 'JOÃO TESTE DA SILVA',
      cpf: cpf,
      inscricao_estadual: '0000000000',
      situacao_ie: 'Habilitado',
      tipo_ie: 'IE de Produtor Rural',
      municipio: 'CURITIBA',
      codigo_ibge: '4106902',
      uf: 'PR',
      cnae: '0111-3/01',
      regime: 'Simples Nacional',
      tipo_produtor: 'Pessoa Física',
      situacao_cpf: 'Regular',
      endereco: 'RUA TESTE, 100 - CENTRO',
    })
  }

  var responseData = {
    success: true,
    environment: 'mock',
    source: 'MOCK',
    quantidade: cadastros.length,
    cadastros: cadastros,
  }

  var consultaId = $security.randomString(32)
  try {
    var consultasCol = $app.findCollectionByNameOrId('consultas')
    var consulta = new Record(consultasCol)
    consulta.set('cpf', cpf)
    consulta.set('consulta_id', consultaId)
    consulta.set('resultado_json', JSON.stringify(responseData))
    consulta.set('utilizada', false)
    $app.save(consulta)
    responseData.consulta_id = consultaId
  } catch (_) {}

  return e.json(200, responseData)
})
