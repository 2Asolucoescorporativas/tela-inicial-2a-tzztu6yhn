routerAdd('POST', '/backend/v1/cadastro/consultar-propriedades', (e) => {
  var body = e.requestInfo().body || {}
  var cpf = String(body.cpf || '').replace(/\D/g, '')
  var requestId = $security.randomString(16)
  var startTime = new Date().getTime()
  var maskedCpf = '***.***.***-' + cpf.slice(-2)

  function logResult(result, extraKv) {
    var kv = [
      'request_id',
      requestId,
      'cpf',
      maskedCpf,
      'duration_ms',
      new Date().getTime() - startTime,
      'result',
      result,
    ]
    if (extraKv) {
      for (var i = 0; i < extraKv.length; i++) {
        kv.push(extraKv[i])
      }
    }
    $app.logger().info('consulta_propriedades', kv)
  }

  if (cpf.length !== 11) {
    logResult('invalid_cpf')
    return e.json(400, { success: false, error: 'cpf_invalido', message: 'Informe um CPF válido.' })
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    logResult('invalid_cpf')
    return e.json(400, { success: false, error: 'cpf_invalido', message: 'Informe um CPF válido.' })
  }

  var sum1 = 0
  for (var i = 0; i < 9; i++) sum1 += parseInt(cpf.charAt(i)) * (10 - i)
  var d1 = 11 - (sum1 % 11)
  if (d1 >= 10) d1 = 0
  if (d1 !== parseInt(cpf.charAt(9))) {
    logResult('invalid_cpf')
    return e.json(400, { success: false, error: 'cpf_invalido', message: 'Informe um CPF válido.' })
  }
  var sum2 = 0
  for (var i = 0; i < 10; i++) sum2 += parseInt(cpf.charAt(i)) * (11 - i)
  var d2 = 11 - (sum2 % 11)
  if (d2 >= 10) d2 = 0
  if (d2 !== parseInt(cpf.charAt(10))) {
    logResult('invalid_cpf')
    return e.json(400, { success: false, error: 'cpf_invalido', message: 'Informe um CPF válido.' })
  }

  try {
    $app.findFirstRecordByFilter(
      '_pb_users_auth_',
      "cpf = '" + cpf + "' && cadastro_concluido = true",
    )
    logResult('already_registered')
    return e.json(200, {
      success: false,
      ja_cadastrado: true,
      message: 'Este CPF já possui cadastro no 2A Rural.',
    })
  } catch (_) {}

  var ipAddr = String(e.request.remoteAddr || '').split(':')[0]
  if (!ipAddr) ipAddr = 'unknown'
  var now = new Date()
  var twentyFourHoursAgoMs = now.getTime() - 24 * 60 * 60 * 1000
  var oneHourAgoMs = now.getTime() - 60 * 60 * 1000

  var cpfConsultas = []
  try {
    cpfConsultas = $app.findRecordsByFilter('consultas', "cpf = '" + cpf + "'", '-created', 100, 0)
  } catch (_) {}
  var cpfCount = 0
  for (var i = 0; i < cpfConsultas.length; i++) {
    var cStr = cpfConsultas[i].getString('created')
    if (cStr) {
      var cDate = new Date(String(cStr).replace(' ', 'T') + 'Z')
      if (cDate.getTime() > twentyFourHoursAgoMs) cpfCount++
    }
  }
  if (cpfCount >= 5) {
    logResult('rate_limited_cpf')
    return e.json(429, {
      success: false,
      error: 'rate_limit',
      message: 'Muitas consultas realizadas para este CPF. Tente novamente em algumas horas.',
    })
  }

  var ipConsultas = []
  try {
    ipConsultas = $app.findRecordsByFilter(
      'consultas',
      "ip_origem = '" + ipAddr + "'",
      '-created',
      100,
      0,
    )
  } catch (_) {}
  var ipCount = 0
  for (var i = 0; i < ipConsultas.length; i++) {
    var cStr = ipConsultas[i].getString('created')
    if (cStr) {
      var cDate = new Date(String(cStr).replace(' ', 'T') + 'Z')
      if (cDate.getTime() > oneHourAgoMs) ipCount++
    }
  }
  if (ipCount >= 10) {
    logResult('rate_limited_ip', ['ip', ipAddr])
    return e.json(429, {
      success: false,
      error: 'rate_limit',
      message: 'Muitas consultas realizadas. Tente novamente mais tarde.',
    })
  }

  var DEFAULT_UF = 'PR'
  var apiBaseUrl = $secrets.get('SINTEGRA_API_BASE_URL') || ''
  var apiKey = $secrets.get('SINTEGRA_API_KEY') || ''
  var hasSecrets = $secrets.has('SINTEGRA_API_BASE_URL') && $secrets.has('SINTEGRA_API_KEY')

  var externalData = null
  var origem = 'mock'
  var origemCache = false
  var internalErrorCode = null

  if (hasSecrets && apiBaseUrl && apiKey) {
    var maxRetries = 2
    var attempt = 0
    while (attempt <= maxRetries) {
      attempt++
      try {
        var res = $http.send({
          url:
            apiBaseUrl +
            '/consultas/v2/produtor-rural/' +
            cpf +
            '?uf=' +
            DEFAULT_UF +
            '&cache_strategy=ONLINE_PREFERENCIAL&cache=7&error_fallback=true&endereco=true',
          method: 'GET',
          headers: { 'x-api-key': apiKey, Accept: 'application/json' },
          timeout: 10,
        })

        if (res.statusCode === 200) {
          externalData = res.json
          origem = 'sintegra'
          if (
            externalData &&
            (externalData.cache === true ||
              externalData.origem === 'cache' ||
              externalData.cached === true ||
              externalData.is_cache === true)
          ) {
            origemCache = true
          }
          break
        }

        if (res.statusCode === 502 || res.statusCode === 503 || res.statusCode === 504) {
          if (attempt > maxRetries) internalErrorCode = 'INTEGRATION_INVALID_RESPONSE'
          continue
        }
        if (res.statusCode === 401 || res.statusCode === 403) {
          internalErrorCode = 'INTEGRATION_AUTH_ERROR'
          break
        }
        if (res.statusCode === 429) {
          internalErrorCode = 'INTEGRATION_RATE_LIMIT'
          break
        }
        internalErrorCode = 'INTEGRATION_INVALID_RESPONSE'
        break
      } catch (err) {
        if (attempt > maxRetries) internalErrorCode = 'INTEGRATION_NETWORK_ERROR'
        continue
      }
    }

    if (!externalData && internalErrorCode) {
      var userMsg =
        'Não foi possível obter os dados cadastrais. Tente novamente em alguns instantes.'
      if (internalErrorCode === 'INTEGRATION_AUTH_ERROR') {
        userMsg = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.'
      } else if (internalErrorCode === 'INTEGRATION_RATE_LIMIT') {
        userMsg = 'Muitas consultas realizadas. Tente novamente mais tarde.'
      } else if (internalErrorCode === 'INTEGRATION_NETWORK_ERROR') {
        userMsg = 'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.'
      }
      logResult('integration_error', [
        'internal_error_code',
        internalErrorCode,
        'origem_cache',
        false,
        'quantity',
        0,
      ])
      return e.json(502, { success: false, error: internalErrorCode, message: userMsg })
    }
  }

  if (!externalData) {
    origem = 'mock'
    var mockNome = ''
    var mockProps = []

    if (cpf === '11111111111') {
      mockNome = 'ANTÔNIO CARLOS RIBEIRO'
      mockProps.push({
        inscricao_estadual: '9020829380',
        uf: 'PR',
        ativa: true,
        tipo_ie: 'IE de Produtor Rural',
        situacao_cadastral: 'Habilitado',
        data_status: '2024-01-15',
        municipio: 'CURITIBA',
        codigo_municipio_ibge: '4106902',
        logradouro: 'RUA DAS FLORES',
        numero: '123',
        bairro: 'CENTRO',
        cep: '80000000',
      })
    } else if (cpf === '22222222222') {
      mockNome = 'MARIA JOSÉ FERREIRA'
      mockProps.push({
        inscricao_estadual: '9031738401',
        uf: 'PR',
        ativa: true,
        tipo_ie: 'IE de Produtor Rural',
        situacao_cadastral: 'Habilitado',
        data_status: '2024-01-15',
        municipio: 'CURITIBA',
        codigo_municipio_ibge: '4106902',
        logradouro: 'AV. VISCONDE DE TAUNAY',
        numero: '456',
        bairro: 'CENTRO',
        cep: '80000000',
      })
      mockProps.push({
        inscricao_estadual: '9042847512',
        uf: 'PR',
        ativa: true,
        tipo_ie: 'IE de Produtor Rural',
        situacao_cadastral: 'Habilitado',
        data_status: '2024-01-15',
        municipio: 'PONTA GROSSA',
        codigo_municipio_ibge: '4119905',
        logradouro: 'RUA MARECHAL',
        numero: '789',
        bairro: 'CENTRO',
        cep: '84000000',
      })
    } else if (cpf === '33333333333') {
      mockNome = ''
      mockProps = []
    } else if (cpf === '44444444444') {
      mockNome = 'PEDRO ALVES SOUZA'
      mockProps.push({
        inscricao_estadual: '9053958623',
        uf: 'PR',
        ativa: true,
        tipo_ie: 'IE Normal',
        situacao_cadastral: 'Habilitado',
        data_status: '2024-01-15',
        municipio: 'GUARAPUAVA',
        codigo_municipio_ibge: '4109401',
        logradouro: 'RUA PADRE SALDANHA',
        numero: '789',
        bairro: 'CENTRO',
        cep: '85000000',
      })
    } else if (cpf === '55555555555') {
      mockNome = 'LUCIANA PEREIRA LIMA'
      mockProps.push({
        inscricao_estadual: '9065069734',
        uf: 'PR',
        ativa: false,
        tipo_ie: 'IE de Produtor Rural',
        situacao_cadastral: 'Suspensa',
        data_status: '2024-01-15',
        municipio: 'CASCAVEL',
        codigo_municipio_ibge: '4104808',
        logradouro: 'AV. BRASIL',
        numero: '321',
        bairro: 'CENTRO',
        cep: '85800000',
      })
    } else {
      mockNome = 'JOÃO TESTE DA SILVA'
      mockProps.push({
        inscricao_estadual: '0000000000',
        uf: 'PR',
        ativa: true,
        tipo_ie: 'IE de Produtor Rural',
        situacao_cadastral: 'Habilitado',
        data_status: '2024-01-15',
        municipio: 'CURITIBA',
        codigo_municipio_ibge: '4106902',
        logradouro: 'RUA TESTE',
        numero: '100',
        bairro: 'CENTRO',
        cep: '80000000',
      })
    }

    externalData = { nome: mockNome, cpf: cpf, inscricoes: mockProps, origem: 'mock', cache: false }
  }

  console.log('TEMPORARY DIAGNOSTIC - FULL API RESPONSE:', JSON.stringify(externalData))

  var nomeConsulta = externalData.nome || externalData.razao_social || ''
  var inscricoes = externalData.inscricoes || externalData.propriedades || []

  var propriedades = []
  for (var i = 0; i < inscricoes.length; i++) {
    var insc = inscricoes[i]
    var ativa =
      insc.ativa !== undefined
        ? insc.ativa === true
        : String(insc.situacao || insc.situacao_cadastral || '').toLowerCase() === 'habilitado' ||
          String(insc.situacao || '').toLowerCase() === 'ativo'
    var tipoIe = String(insc.tipo_ie || insc.tipo || '').trim()
    var elegivel = ativa === true && tipoIe.toLowerCase() === 'ie de produtor rural'
    var motivo = null

    if (!elegivel) {
      if (!ativa) {
        motivo = 'Esta inscrição não está ativa.'
      } else if (tipoIe.toLowerCase() !== 'ie de produtor rural') {
        motivo = 'Esta inscrição não é classificada como IE de Produtor Rural.'
      }
    }

    propriedades.push({
      inscricao_estadual: String(insc.inscricao_estadual || insc.ie || ''),
      uf: String(insc.uf || DEFAULT_UF),
      ativa: ativa,
      tipo_ie: tipoIe,
      situacao_cadastral: String(
        insc.situacao_cadastral || insc.situacao || insc.situacao_ie || '',
      ),
      data_status: String(insc.data_status || insc.data || ''),
      municipio: String(insc.municipio || ''),
      codigo_municipio_ibge: String(insc.codigo_municipio_ibge || insc.codigo_ibge || ''),
      logradouro: String(insc.logradouro || insc.endereco || ''),
      numero: String(insc.numero || ''),
      bairro: String(insc.bairro || ''),
      cep: String(insc.cep || ''),
      elegivel_cadastro: elegivel,
      motivo_inelegibilidade: motivo,
    })
  }

  var quantidadeElegivel = 0
  for (var i = 0; i < propriedades.length; i++) {
    if (propriedades[i].elegivel_cadastro) quantidadeElegivel++
  }

  var consultaId = $security.randomString(32)
  var dataExpiracao = new Date(now.getTime() + 30 * 60 * 1000)

  var normalizedData = {
    success: true,
    consulta_id: consultaId,
    cpf: cpf,
    nome: nomeConsulta,
    uf_consultada: DEFAULT_UF,
    origem: origem,
    origem_cache: origemCache,
    is_cache: origemCache,
    quantidade_encontrada: propriedades.length,
    quantidade_elegivel: quantidadeElegivel,
    propriedades: propriedades,
  }

  try {
    var consultasCol = $app.findCollectionByNameOrId('consultas')
    var consulta = new Record(consultasCol)
    consulta.set('cpf', cpf)
    consulta.set('consulta_id', consultaId)
    consulta.set('resultado_json', JSON.stringify(normalizedData))
    consulta.set('resultado_normalizado', JSON.stringify(normalizedData))
    consulta.set('utilizada', false)
    consulta.set('uf_consultada', DEFAULT_UF)
    consulta.set('nome', nomeConsulta)
    consulta.set('origem', origem)
    consulta.set('origem_cache', origemCache)
    consulta.set('data_expiracao', dataExpiracao)
    consulta.set('ip_origem', ipAddr)
    $app.save(consulta)
  } catch (err) {
    $app
      .logger()
      .error(
        'consulta_propriedades_store_error',
        'request_id',
        requestId,
        'cpf',
        maskedCpf,
        'error',
        String((err && err.message) || err),
      )
  }

  logResult('success', [
    'origem_cache',
    origemCache,
    'quantity',
    propriedades.length,
    'eligible',
    quantidadeElegivel,
    'internal_error_code',
    internalErrorCode || '',
  ])

  return e.json(200, normalizedData)
})
