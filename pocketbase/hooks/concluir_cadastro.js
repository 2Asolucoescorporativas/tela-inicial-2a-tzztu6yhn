routerAdd('POST', '/backend/v1/cadastro/concluir', (e) => {
  var body = e.requestInfo().body || {}
  var consultaId = String(body.consulta_id || '')
  var cpf = String(body.cpf || '').replace(/\D/g, '')
  var senha = String(body.senha || '')
  var confirmacaoSenha = String(body.confirmacao_senha || '')
  var propriedades = body.propriedades || []

  if (cpf.length !== 11) {
    return e.json(400, { success: false, error: 'CPF inválido.' })
  }

  var consulta
  try {
    consulta = $app.findFirstRecordByFilter('consultas', "consulta_id = '" + consultaId + "'")
  } catch (_) {
    return e.json(400, { success: false, error: 'Consulta não encontrada.' })
  }

  if (consulta.getString('cpf') !== cpf) {
    return e.json(400, { success: false, error: 'CPF não corresponde à consulta.' })
  }
  if (consulta.getBool('utilizada')) {
    return e.json(400, { success: false, error: 'Esta consulta já foi utilizada.' })
  }

  var createdStr = consulta.getString('created').replace(' ', 'T')
  if (createdStr.length > 0 && createdStr.charAt(createdStr.length - 1) !== 'Z') {
    createdStr = createdStr + 'Z'
  }
  var createdMs = new Date(createdStr).getTime()
  var nowMs = new Date().getTime()
  if (nowMs - createdMs > 30 * 60 * 1000) {
    return e.json(400, {
      success: false,
      error: 'A consulta cadastral expirou. Consulte novamente o CPF para continuar.',
    })
  }

  try {
    $app.findFirstRecordByFilter(
      '_pb_users_auth_',
      "cpf = '" + cpf + "' && cadastro_concluido = true",
    )
    return e.json(400, { success: false, error: 'Este CPF já possui cadastro no 2A Rural.' })
  } catch (_) {}

  if (!Array.isArray(propriedades) || propriedades.length === 0) {
    return e.json(400, {
      success: false,
      error: 'Selecione pelo menos uma propriedade para continuar.',
    })
  }

  var resultadoJson = JSON.parse(consulta.getString('resultado_json'))
  var cadastros = resultadoJson.cadastros || []

  function findCadastro(ie) {
    for (var j = 0; j < cadastros.length; j++) {
      if (cadastros[j].inscricao_estadual === ie) return cadastros[j]
    }
    return null
  }

  for (var i = 0; i < propriedades.length; i++) {
    var ie = String(propriedades[i].inscricao_estadual || '')
    var found = findCadastro(ie)
    if (!found) {
      return e.json(400, {
        success: false,
        error: 'Inscrição estadual ' + ie + ' não encontrada na consulta.',
      })
    }
    if (found.situacao_ie !== 'Habilitado') {
      return e.json(400, { success: false, error: 'A inscrição ' + ie + ' não está habilitada.' })
    }
    if (found.tipo_ie !== 'IE de Produtor Rural') {
      return e.json(400, {
        success: false,
        error: 'A inscrição ' + ie + ' não é classificada como IE de Produtor Rural.',
      })
    }
  }

  var normalizedNames = {}
  for (var i = 0; i < propriedades.length; i++) {
    var nome = String(propriedades[i].nome || '').trim()
    if (nome.length < 3 || nome.length > 50) {
      return e.json(400, {
        success: false,
        error: 'O nome da propriedade deve ter entre 3 e 50 caracteres.',
      })
    }
    if (!/^[a-zA-Z0-9\u00C0-\u00FF\s]+$/.test(nome)) {
      return e.json(400, {
        success: false,
        error: 'O nome da propriedade deve conter apenas letras, números e espaços.',
      })
    }
    if (/^\d+$/.test(nome.replace(/\s/g, ''))) {
      return e.json(400, {
        success: false,
        error: 'O nome da propriedade não pode conter apenas números.',
      })
    }
    if (nome.replace(/\s/g, '').length === 0) {
      return e.json(400, {
        success: false,
        error: 'O nome da propriedade não pode conter apenas espaços.',
      })
    }
    var norm = nome.replace(/\s+/g, ' ').toLowerCase()
    if (normalizedNames[norm]) {
      return e.json(400, {
        success: false,
        error: 'Já existe uma propriedade com esse nome. Escolha outro nome.',
      })
    }
    normalizedNames[norm] = true
  }

  var existingUser = null
  try {
    existingUser = $app.findFirstRecordByFilter('_pb_users_auth_', "cpf = '" + cpf + "'")
  } catch (_) {}

  if (existingUser) {
    for (var key in normalizedNames) {
      try {
        $app.findFirstRecordByFilter(
          'propriedades',
          "usuario_id = '" + existingUser.id + "' && nome_normalizado = '" + key + "'",
        )
        return e.json(400, {
          success: false,
          error: 'Já existe uma propriedade com esse nome. Escolha outro nome.',
        })
      } catch (_) {}
    }
  }

  if (!/^\d{6}$/.test(senha)) {
    return e.json(400, {
      success: false,
      error: 'A senha deve possuir exatamente 6 dígitos numéricos.',
    })
  }
  if (/^(\d)\1{5}$/.test(senha)) {
    return e.json(400, {
      success: false,
      error: 'Crie uma senha numérica de 6 dígitos que não seja uma sequência simples ou repetida.',
    })
  }
  var asc = '0123456789'
  var desc = '9876543210'
  if (asc.indexOf(senha) !== -1 || desc.indexOf(senha) !== -1) {
    return e.json(400, {
      success: false,
      error: 'Crie uma senha numérica de 6 dígitos que não seja uma sequência simples ou repetida.',
    })
  }
  if (senha === cpf.substring(0, 6) || senha === cpf.substring(5, 11)) {
    return e.json(400, {
      success: false,
      error: 'Crie uma senha numérica de 6 dígitos que não seja uma sequência simples ou repetida.',
    })
  }
  if (senha !== confirmacaoSenha) {
    return e.json(400, { success: false, error: 'As senhas informadas não são iguais.' })
  }

  var userName = cadastros.length > 0 ? cadastros[0].nome : ''
  var propDataList = []
  for (var i = 0; i < propriedades.length; i++) {
    var ie = String(propriedades[i].inscricao_estadual || '')
    var found = findCadastro(ie)
    var nome = String(propriedades[i].nome || '').trim()
    propDataList.push({
      nome: nome,
      nome_normalizado: nome.replace(/\s+/g, ' ').toLowerCase(),
      inscricao_estadual: ie,
      situacao_ie: found.situacao_ie,
      tipo_ie: found.tipo_ie,
      municipio: found.municipio || '',
      codigo_ibge: found.codigo_ibge || '',
      uf: found.uf || '',
      endereco: found.endereco || '',
      cnae: found.cnae || '',
      tipo_produtor: found.tipo_produtor || '',
    })
  }

  var now = new Date()
  var y = now.getFullYear()
  var mo = now.getMonth() + 1
  var da = now.getDate()
  var dateStr = y + '-' + (mo < 10 ? '0' + mo : '' + mo) + '-' + (da < 10 ? '0' + da : '' + da)

  try {
    $app.dao().runInTransaction(function (dao) {
      var usersCol = dao.findCollectionByNameOrId('_pb_users_auth_')
      var userRecord

      if (existingUser) {
        userRecord = dao.findRecordById('_pb_users_auth_', existingUser.id)
      } else {
        userRecord = new Record(usersCol)
      }

      userRecord.setEmail(cpf + '@cadastro.2arural.com.br')
      userRecord.setPassword(senha)
      userRecord.setVerified(true)
      userRecord.set('name', userName)
      userRecord.set('cpf', cpf)
      userRecord.set('cadastro_concluido', true)
      userRecord.set('senha_hash', $security.sha256(senha))
      userRecord.set('data_cadastro_concluido', dateStr)
      userRecord.set('data_criacao_senha', dateStr)
      userRecord.set('data_ultima_alteracao_senha', dateStr)
      dao.saveRecord(userRecord)

      var propCol = dao.findCollectionByNameOrId('propriedades')
      for (var i = 0; i < propDataList.length; i++) {
        var pd = propDataList[i]
        var propRecord = new Record(propCol)
        propRecord.set('usuario_id', userRecord.id)
        propRecord.set('nome', pd.nome)
        propRecord.set('nome_normalizado', pd.nome_normalizado)
        propRecord.set('inscricao_estadual', pd.inscricao_estadual)
        propRecord.set('situacao_ie', pd.situacao_ie)
        propRecord.set('tipo_ie', pd.tipo_ie)
        propRecord.set('municipio', pd.municipio)
        propRecord.set('codigo_ibge', pd.codigo_ibge)
        propRecord.set('uf', pd.uf)
        propRecord.set('endereco', pd.endereco)
        propRecord.set('cnae', pd.cnae)
        propRecord.set('tipo_produtor', pd.tipo_produtor)
        propRecord.set('ativo', true)
        dao.saveRecord(propRecord)
      }

      var consultaRecord = dao.findRecordById('consultas', consulta.id)
      consultaRecord.set('utilizada', true)
      dao.saveRecord(consultaRecord)
    })
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao concluir cadastro. Tente novamente.' })
  }

  return e.json(200, {
    success: true,
    message: 'Cadastro concluído com sucesso.',
    quantidade_propriedades: propriedades.length,
  })
})
