routerAdd('POST', '/backend/v1/cadastro/concluir', (e) => {
  var body = e.requestInfo().body || {}
  var consultaId = String(body.consulta_id || '')
  var cpf = String(body.cpf || '').replace(/\D/g, '')
  var senha = String(body.senha || '')
  var confirmacaoSenha = String(body.confirmacao_senha || '')
  var propriedades = body.propriedades || []

  console.log('[concluir_cadastro] iniciando: cpf=' + cpf + ', consulta_id=' + consultaId)

  if (cpf.length !== 11) {
    console.log('[concluir_cadastro] erro: CPF inválido')
    return e.json(400, { success: false, error: 'CPF inválido.' })
  }

  var consulta
  try {
    consulta = $app.findFirstRecordByFilter('consultas', "consulta_id = '" + consultaId + "'")
  } catch (err) {
    console.log('[concluir_cadastro] erro: consulta não encontrada - ' + (err.message || err))
    return e.json(400, { success: false, error: 'Consulta não encontrada.' })
  }

  if (consulta.getString('cpf') !== cpf) {
    console.log('[concluir_cadastro] erro: CPF não corresponde à consulta')
    return e.json(400, { success: false, error: 'CPF não corresponde à consulta.' })
  }

  if (consulta.getBool('utilizada')) {
    console.log('[concluir_cadastro] erro: consulta já utilizada')
    return e.json(400, { success: false, error: 'Esta consulta já foi utilizada.' })
  }

  var createdStr = consulta.getString('created').replace(' ', 'T')
  if (createdStr.length > 0 && createdStr.charAt(createdStr.length - 1) !== 'Z') {
    createdStr = createdStr + 'Z'
  }
  var createdMs = new Date(createdStr).getTime()
  var nowMs = new Date().getTime()
  if (createdMs && nowMs - createdMs > 30 * 60 * 1000) {
    console.log('[concluir_cadastro] erro: consulta expirada')
    return e.json(400, {
      success: false,
      error: 'A consulta cadastral expirou. Consulte novamente o CPF para continuar.',
    })
  }

  try {
    $app.findFirstRecordByFilter('_pb_users_auth_', "cpf = '" + cpf + "'")
    console.log('[concluir_cadastro] erro: CPF já cadastrado')
    return e.json(409, { success: false, error: 'CPF já cadastrado' })
  } catch (_) {}

  if (!Array.isArray(propriedades) || propriedades.length === 0) {
    console.log('[concluir_cadastro] erro: nenhuma propriedade selecionada')
    return e.json(400, {
      success: false,
      error: 'Selecione pelo menos uma propriedade para continuar.',
    })
  }

  var resultadoJson
  try {
    resultadoJson = JSON.parse(consulta.getString('resultado_json'))
  } catch (err) {
    console.log(
      '[concluir_cadastro] erro: falha ao processar resultado_json - ' + (err.message || err),
    )
    return e.json(500, { success: false, error: 'Erro ao processar dados da consulta.' })
  }
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
      console.log('[concluir_cadastro] erro: IE não encontrada - ' + ie)
      return e.json(400, {
        success: false,
        error: 'Inscrição estadual ' + ie + ' não encontrada na consulta.',
      })
    }
    if (found.situacao_ie !== 'Habilitado') {
      console.log('[concluir_cadastro] erro: IE não habilitada - ' + ie)
      return e.json(400, { success: false, error: 'A inscrição ' + ie + ' não está habilitada.' })
    }
    if (found.tipo_ie !== 'IE de Produtor Rural') {
      console.log('[concluir_cadastro] erro: IE não é de produtor rural - ' + ie)
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
      console.log('[concluir_cadastro] erro: nome de propriedade inválido - ' + nome)
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
      console.log('[concluir_cadastro] erro: nome de propriedade duplicado - ' + nome)
      return e.json(409, {
        success: false,
        error: 'Já existe uma propriedade com esse nome. Escolha outro nome.',
      })
    }
    normalizedNames[norm] = true
  }

  if (!/^\d{6}$/.test(senha)) {
    console.log('[concluir_cadastro] erro: senha não tem 6 dígitos')
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
    console.log('[concluir_cadastro] erro: senhas não conferem')
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

  var nowDate = new Date()

  console.log(
    '[concluir_cadastro] iniciando transação: cpf=' + cpf + ', props=' + propDataList.length,
  )

  try {
    $app.runInTransaction(function (txApp) {
      console.log('[concluir_cadastro] criando usuário')
      var usersCol = txApp.findCollectionByNameOrId('_pb_users_auth_')
      var userRecord = new Record(usersCol)

      userRecord.setEmail(cpf + '@cadastro.2arural.com.br')
      userRecord.setPassword(senha)
      userRecord.setVerified(true)
      userRecord.set('name', userName)
      userRecord.set('cpf', cpf)
      userRecord.set('cadastro_concluido', true)
      userRecord.set('data_cadastro_concluido', nowDate)
      userRecord.set('data_criacao_senha', nowDate)
      userRecord.set('data_ultima_alteracao_senha', nowDate)
      txApp.saveNoValidate(userRecord)
      console.log('[concluir_cadastro] usuário criado: id=' + userRecord.id)

      console.log('[concluir_cadastro] salvando propriedades')
      var propCol = txApp.findCollectionByNameOrId('propriedades')
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
        txApp.save(propRecord)
      }
      console.log('[concluir_cadastro] propriedades salvas: ' + propDataList.length)

      console.log('[concluir_cadastro] excluindo consulta')
      var consultaRecord = txApp.findRecordById('consultas', consulta.id)
      txApp.delete(consultaRecord)
      console.log('[concluir_cadastro] consulta excluída: ' + consultaId)
    })
  } catch (err) {
    var errMsg = String((err && err.message) || err || '')
    console.log('[concluir_cadastro] erro na transação: ' + errMsg)
    if (err && err.stack) {
      console.log('[concluir_cadastro] stack: ' + err.stack)
    }

    if (errMsg.indexOf('UNIQUE') !== -1 || errMsg.indexOf('unique') !== -1) {
      if (errMsg.indexOf('cpf') !== -1 || errMsg.indexOf('email') !== -1) {
        console.log('[concluir_cadastro] retornando 409: CPF já cadastrado')
        return e.json(409, { success: false, error: 'CPF já cadastrado' })
      }
      if (errMsg.indexOf('nome_normalizado') !== -1) {
        console.log('[concluir_cadastro] retornando 409: nome de propriedade duplicado')
        return e.json(409, {
          success: false,
          error: 'Já existe uma propriedade com esse nome. Escolha outro nome.',
        })
      }
      if (errMsg.indexOf('inscricao_estadual') !== -1) {
        console.log('[concluir_cadastro] retornando 409: IE duplicada')
        return e.json(409, {
          success: false,
          error: 'Já existe uma propriedade com esta inscrição estadual.',
        })
      }
      return e.json(409, { success: false, error: 'Já existe um cadastro com esses dados.' })
    }

    console.log('[concluir_cadastro] retornando 500: ' + errMsg)
    return e.json(500, { success: false, error: 'Erro ao concluir cadastro: ' + errMsg })
  }

  console.log('[concluir_cadastro] cadastro concluído com sucesso: cpf=' + cpf)

  return e.json(200, {
    success: true,
    message: 'Cadastro concluído com sucesso! Faça seu login.',
    quantidade_propriedades: propriedades.length,
  })
})
