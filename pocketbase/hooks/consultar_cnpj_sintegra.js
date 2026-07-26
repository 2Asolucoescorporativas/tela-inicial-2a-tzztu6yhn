routerAdd(
  'POST',
  '/backend/v1/destinatarios/consultar-cnpj',
  (e) => {
    var body = e.requestInfo().body || {}
    var cnpjRaw = String(body.cnpj || '')
    var cnpj = cnpjRaw.replace(/\D/g, '')

    if (cnpj.length !== 14) {
      return e.json(400, {
        success: false,
        error: 'cnpj_invalido',
        message: 'CNPJ deve conter 14 dígitos.',
      })
    }

    var apiBaseUrl = $secrets.get('SINTEGRA_API_BASE_URL') || ''
    var apiKey = $secrets.get('SINTEGRA_API_KEY') || ''
    var defaultUf = $secrets.get('PRODUTOR_RURAL_DEFAULT_UF') || 'PR'

    var uf = String(body.uf || defaultUf).toUpperCase()

    if (!apiBaseUrl || !apiKey) {
      return e.json(502, {
        success: false,
        error: 'SERVICO_INDISPONIVEL',
        message: 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.',
      })
    }

    if (apiBaseUrl.endsWith('/')) apiBaseUrl = apiBaseUrl.slice(0, -1)

    var requestUrl =
      apiBaseUrl +
      '/consultas/v2/sintegra/' +
      cnpj +
      '?uf=' +
      uf +
      '&cache_strategy=ONLINE_PREFERENCIAL&cache=7&error_fallback=true&endereco=true'

    var res
    try {
      res = $http.send({
        url: requestUrl,
        method: 'GET',
        headers: { 'x-api-key': apiKey, Accept: 'application/json' },
        timeout: 15,
      })
    } catch (err) {
      return e.json(502, {
        success: false,
        error: 'ERRO_CONSULTA',
        message:
          'Não foi possível consultar os dados do CNPJ. Tente novamente em alguns instantes.',
      })
    }

    var rawJson = res.json || {}

    var d = rawJson
    if (d.data && typeof d.data === 'object' && !Array.isArray(d.data)) {
      d = d.data
    } else if (d.dados && typeof d.dados === 'object' && !Array.isArray(d.dados)) {
      d = d.dados
    } else if (d.resultado && typeof d.resultado === 'object' && !Array.isArray(d.resultado)) {
      d = d.resultado
    }

    var rawInscricoes = d.inscricoes_estaduais
    if (!Array.isArray(rawInscricoes)) rawInscricoes = []

    console.log('[DEBUG - consultar_cnpj_sintegra] HTTP status: ' + res.statusCode)
    console.log(
      '[DEBUG - consultar_cnpj_sintegra] Object.keys(data): ' + JSON.stringify(Object.keys(d)),
    )
    console.log(
      '[DEBUG - consultar_cnpj_sintegra] inscricoes_estaduais length: ' + rawInscricoes.length,
    )

    if (res.statusCode === 404 || res.statusCode === 400) {
      return e.json(404, {
        success: false,
        error: 'CNPJ_NAO_ENCONTRADO',
        message: 'CNPJ não encontrado.',
      })
    }

    if (res.statusCode !== 200) {
      return e.json(502, {
        success: false,
        error: 'ERRO_CONSULTA',
        message:
          'Não foi possível consultar os dados do CNPJ. Tente novamente em alguns instantes.',
      })
    }

    var razaoSocial = String(d.razao_social || d.nome || d.nome_empresarial || '')
    var ufFinal = String(d.uf || d.estado || uf).toUpperCase()
    var situacaoPj = String(d.situacao_pj || d.situacao || d.situacao_cadastral || d.status || '')
    var updatedAt = String(d.updated_at || d.data || d.data_consulta || d.data_atualizacao || '')

    var tipoLog = String(d.tipo_logradouro || '').trim()
    var nomeLog = String(d.logradouro || d.endereco || '').trim()
    var logradouro = ''
    if (tipoLog && nomeLog) {
      logradouro = tipoLog + ' ' + nomeLog
    } else if (nomeLog) {
      logradouro = nomeLog
    } else if (tipoLog) {
      logradouro = tipoLog
    }

    var endereco = {
      logradouro: logradouro,
      numero: String(d.numero || ''),
      complemento: String(d.complemento || ''),
      bairro: String(d.bairro || ''),
      municipio: String(d.municipio || d.cidade || ''),
      codigo_ibge: String(d.codigo_ibge || d.codigo_municipio || d.cod_ibge || ''),
      cep: String(d.cep || ''),
      uf: String(d.uf || d.estado || ufFinal),
      pais: 'Brasil',
      codigo_pais: '1058',
    }

    var activeIes = []
    for (var i = 0; i < rawInscricoes.length; i++) {
      var insc = rawInscricoes[i]
      if (!insc || typeof insc !== 'object') continue

      var situacaoVal = String(
        insc.situacao || insc.situacao_ie || insc.situacao_cadastral || insc.status || '',
      )
      var isAtiva =
        situacaoVal.toLowerCase() === 'ativa' || situacaoVal.toLowerCase() === 'habilitado'

      if (!isAtiva) continue

      var inscUf = String(insc.uf || insc.estado || '').toUpperCase()
      if (inscUf && inscUf !== ufFinal) continue

      activeIes.push({
        inscricao_estadual: String(
          insc.inscricao_estadual ||
            insc.inscricao ||
            insc.ie ||
            insc.numero ||
            insc.numero_inscricao ||
            '',
        ),
        tipo_ie: String(insc.tipo_ie || insc.tipo || insc.tipo_inscricao || 'Contribuinte'),
        ativa: true,
      })
    }

    if (activeIes.length === 0) {
      for (var j = 0; j < rawInscricoes.length; j++) {
        var insc2 = rawInscricoes[j]
        if (!insc2 || typeof insc2 !== 'object') continue

        var situacaoVal2 = String(
          insc2.situacao || insc2.situacao_ie || insc2.situacao_cadastral || insc2.status || '',
        )
        var isAtiva2 =
          situacaoVal2.toLowerCase() === 'ativa' || situacaoVal2.toLowerCase() === 'habilitado'

        if (!isAtiva2) continue

        activeIes.push({
          inscricao_estadual: String(
            insc2.inscricao_estadual ||
              insc2.inscricao ||
              insc2.ie ||
              insc2.numero ||
              insc2.numero_inscricao ||
              '',
          ),
          tipo_ie: String(insc2.tipo_ie || insc2.tipo || insc2.tipo_inscricao || 'Contribuinte'),
          ativa: true,
        })
      }
    }

    var inscricaoEstadualField
    if (activeIes.length === 0) {
      inscricaoEstadualField = ''
    } else if (activeIes.length === 1) {
      inscricaoEstadualField = activeIes[0].inscricao_estadual
    } else {
      inscricaoEstadualField = activeIes.map(function (ie) {
        return ie.inscricao_estadual
      })
    }

    var tipoIe = activeIes.length > 0 ? activeIes[0].tipo_ie : 'Não contribuinte'
    var ativa = activeIes.length > 0

    var cnpjFormatted = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')

    var normalized = {
      cnpj: cnpjFormatted,
      razao_social: razaoSocial,
      uf: ufFinal,
      inscricao_estadual: inscricaoEstadualField,
      ativa: ativa,
      tipo_ie: tipoIe,
      situacao_pj: situacaoPj,
      updated_at: updatedAt,
      endereco: endereco,
    }

    if (activeIes.length > 1) {
      normalized.inscricoes_ativas = activeIes
    }

    return e.json(200, { success: true, data: normalized })
  },
  $apis.requireAuth(),
)
