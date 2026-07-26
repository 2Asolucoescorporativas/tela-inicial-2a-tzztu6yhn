routerAdd('POST', '/backend/v1/cadastro/concluir-cadastro', (e) => {
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
  } catch (err) {
    return e.json(400, { success: false, error: 'Consulta não encontrada.' })
  }

  if (consulta.getString('cpf') !== cpf) {
    return e.json(400, { success: false, error: 'CPF não corresponde à consulta.' })
  }

  if (consulta.getBool('utilizada')) {
    return e.json(400, { success: false, error: 'Esta consulta já foi utilizada.' })
  }

  var nowMs = new Date().getTime()
  var expiracaoStr = consulta.getString('data_expiracao')
  if (expiracaoStr) {
    var expMs = new Date(String(expiracaoStr).replace(' ', 'T') + 'Z').getTime()
    if (expMs && nowMs > expMs) {
      return e.json(400, {
        success: false,
        error: 'A consulta cadastral expirou. Consulte novamente o CPF para continuar.',
      })
    }
  } else {
    var createdStr = consulta.getString('created').replace(' ', 'T')
    if (createdStr.length > 0 && createdStr.charAt(createdStr.length - 1) !== 'Z') {
      createdStr = createdStr + 'Z'
    }
    var createdMs = new Date(createdStr).getTime()
    if (createdMs && nowMs - createdMs > 30 * 60 * 1000) {
      return e.json(400, {
        success: false,
        error: 'A consulta cadastral expirou. Consulte novamente o CPF para continuar.',
      })
    }
  }

  try {
    $app.findFirstRecordByFilter('_pb_users_auth_', "cpf = '" + cpf + "'")
    return e.json(409, { success: false, error: 'CPF já cadastrado' })
  } catch (_) {}

  if (!Array.isArray(propriedades) || propriedades.length === 0) {
    return e.json(400, {
      success: false,
      error: 'Selecione pelo menos uma propriedade para continuar.',
    })
  }

  var resultadoJson
  var rawStr = consulta.getString('resultado_normalizado') || consulta.getString('resultado_json')
  try {
    resultadoJson = JSON.parse(rawStr)
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao processar dados da consulta.' })
  }
  var propsConsultadas = resultadoJson.propriedades || resultadoJson.cadastros || []

  function findPropriedade(ie) {
    for (var j = 0; j < propsConsultadas.length; j++) {
      if (propsConsultadas[j].inscricao_estadual === ie) return propsConsultadas[j]
    }
    return null
  }

  for (var i = 0; i < propriedades.length; i++) {
    var ie = String(propriedades[i].inscricao_estadual || '')
    var found = findPropriedade(ie)
    if (!found) {
      return e.json(400, {
        success: false,
        error: 'Inscrição estadual ' + ie + ' não encontrada na consulta.',
      })
    }
    if (found.elegivel_cadastro !== undefined) {
      if (!found.elegivel_cadastro) {
        return e.json(400, {
          success: false,
          error: 'A inscrição ' + ie + ' não é elegível para cadastro.',
        })
      }
    } else {
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
      return e.json(409, {
        success: false,
        error: 'Já existe uma propriedade com esse nome. Escolha outro nome.',
      })
    }
    normalizedNames[norm] = true
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

  var userName =
    resultadoJson.nome || (propsConsultadas.length > 0 ? propsConsultadas[0].nome || '' : '')
  var propDataList = []
  for (var i = 0; i < propriedades.length; i++) {
    var ie = String(propriedades[i].inscricao_estadual || '')
    var found = findPropriedade(ie)
    var nome = String(propriedades[i].nome || '').trim()

    var enderecoParts = []
    var logradouro = String(found.logradouro || found.endereco || '')
    var numero = String(found.numero || '')
    var bairro = String(found.bairro || '')
    if (logradouro) enderecoParts.push(logradouro)
    if (numero) enderecoParts.push(numero)
    if (bairro) enderecoParts.push(bairro)
    var endereco = enderecoParts.join(', ')

    propDataList.push({
      nome: nome,
      nome_normalizado: nome.replace(/\s+/g, ' ').toLowerCase(),
      inscricao_estadual: ie,
      situacao_ie: String(found.situacao_cadastral || found.situacao_ie || ''),
      tipo_ie: String(found.tipo_ie || ''),
      municipio: String(found.municipio || ''),
      codigo_ibge: String(found.codigo_municipio_ibge || found.codigo_ibge || ''),
      uf: String(found.uf || ''),
      endereco: endereco,
      cnae: String(found.cnae || ''),
      tipo_produtor: String(found.tipo_produtor || ''),
    })
  }

  var nowDate = new Date()

  try {
    $app.runInTransaction(function (txApp) {
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

      var consultaRecord = txApp.findRecordById('consultas', consulta.id)
      txApp.delete(consultaRecord)
    })
  } catch (err) {
    var errMsg = String((err && err.message) || err || '')

    if (errMsg.indexOf('UNIQUE') !== -1 || errMsg.indexOf('unique') !== -1) {
      if (errMsg.indexOf('cpf') !== -1 || errMsg.indexOf('email') !== -1) {
        return e.json(409, { success: false, error: 'CPF já cadastrado' })
      }
      if (errMsg.indexOf('nome_normalizado') !== -1) {
        return e.json(409, {
          success: false,
          error: 'Já existe uma propriedade com esse nome. Escolha outro nome.',
        })
      }
      if (errMsg.indexOf('inscricao_estadual') !== -1) {
        return e.json(409, {
          success: false,
          error: 'Já existe uma propriedade com esta inscrição estadual.',
        })
      }
      return e.json(409, { success: false, error: 'Já existe um cadastro com esses dados.' })
    }

    return e.json(500, { success: false, error: 'Erro ao concluir cadastro: ' + errMsg })
  }

  return e.json(200, {
    success: true,
    message: 'Cadastro concluído com sucesso! Faça seu login.',
    quantidade_propriedades: propriedades.length,
  })
})
