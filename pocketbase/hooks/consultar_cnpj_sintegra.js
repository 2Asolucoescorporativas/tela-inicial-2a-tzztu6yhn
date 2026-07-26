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

    var d = res.json || {}

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

    var ufFinal = String(d.uf || d.estado || uf).toUpperCase()

    function normalizeEndereco(endObj, fallbackUf) {
      var end = {}
      if (endObj && typeof endObj === 'object' && !Array.isArray(endObj)) {
        end = endObj
      }

      var tipoLog = String(end.tipo_logradouro || '').trim()
      var nomeLog = String(end.logradouro || '').trim()
      var logradouro = ''
      if (tipoLog && nomeLog) {
        logradouro = tipoLog + ' ' + nomeLog
      } else if (nomeLog) {
        logradouro = nomeLog
      } else if (tipoLog) {
        logradouro = tipoLog
      }

      var codigoIbge = String(
        end.codigo_municipio_ibge || end.codigo_ibge || end.codigo_municipio || end.cod_ibge || '',
      )

      return {
        logradouro: logradouro,
        numero: String(end.numero || ''),
        complemento: String(end.complemento || ''),
        bairro: String(end.bairro || ''),
        municipio: String(end.municipio || end.cidade || ''),
        codigo_municipio_ibge: codigoIbge,
        codigo_ibge: codigoIbge,
        cep: String(end.cep || ''),
        uf: String(end.uf || fallbackUf || '').toUpperCase(),
        pais: 'Brasil',
        codigo_pais: '1058',
      }
    }

    function extractIeItem(insc) {
      var inscEst = String(
        insc.inscricao_estadual ||
          insc.inscricao ||
          insc.ie ||
          insc.numero ||
          insc.numero_inscricao ||
          '',
      )
      var tipoIeVal = String(insc.tipo_ie || insc.tipo || insc.tipo_inscricao || 'Contribuinte')
      var inscUf = String(insc.uf || insc.estado || '').toUpperCase()
      var end = normalizeEndereco(insc.endereco, inscUf)

      return {
        inscricao_estadual: inscEst,
        tipo_ie: tipoIeVal,
        uf: inscUf,
        endereco: end,
      }
    }

    var rawInscricoes = d.inscricoes_estaduais
    if (!Array.isArray(rawInscricoes)) rawInscricoes = []

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

      var item = extractIeItem(insc)
      item.ativa = true
      activeIes.push(item)
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

        var item2 = extractIeItem(insc2)
        item2.ativa = true
        activeIes.push(item2)
      }
    }

    if (activeIes.length === 0 && rawInscricoes.length > 0) {
      var firstIe = rawInscricoes[0]
      if (firstIe && typeof firstIe === 'object') {
        var item3 = extractIeItem(firstIe)
        item3.ativa = false
        activeIes.push(item3)
      }
    }

    var inscricaoEstadualField
    if (activeIes.length === 0) {
      inscricaoEstadualField = ''
    } else if (activeIes.length === 1) {
      inscricaoEstadualField = activeIes[0].inscricao_estadual
    } else {
      inscricaoEstadualField = []
      for (var k = 0; k < activeIes.length; k++) {
        inscricaoEstadualField.push(activeIes[k].inscricao_estadual)
      }
    }

    var tipoIe = activeIes.length > 0 ? activeIes[0].tipo_ie : 'Não contribuinte'
    var ativa = activeIes.length > 0

    if (activeIes.length > 0 && activeIes[0].uf) {
      ufFinal = activeIes[0].uf
    }

    var cnpjFormatted = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')

    var razaoSocial = String(d.razao_social || d.nome || d.nome_empresarial || '')

    var endereco = {}
    if (activeIes.length > 0 && activeIes[0].endereco) {
      endereco = activeIes[0].endereco
    }

    var normalized = {
      cnpj: cnpjFormatted,
      razao_social: razaoSocial,
      uf: ufFinal,
      inscricao_estadual: inscricaoEstadualField,
      ativa: ativa,
      tipo_ie: tipoIe,
      situacao_pj: String(d.situacao_pj || d.situacao || d.situacao_cadastral || d.status || ''),
      updated_at: String(d.updated_at || d.data || d.data_consulta || d.data_atualizacao || ''),
      endereco: endereco,
    }

    if (activeIes.length > 0) {
      normalized.inscricoes_ativas = activeIes
    }

    return e.json(200, { success: true, data: normalized })
  },
  $apis.requireAuth(),
)
