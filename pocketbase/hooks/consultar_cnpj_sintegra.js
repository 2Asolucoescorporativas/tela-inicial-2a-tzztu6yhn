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
      defaultUf +
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

    var rawJson = res.json || {}

    // Unwrap nested response — SintegraAPI v2 may nest the payload under
    // 'data', 'dados', or 'resultado'. Fall back to the top-level object.
    var d = rawJson
    if (d.data && typeof d.data === 'object' && !Array.isArray(d.data)) {
      d = d.data
    } else if (d.dados && typeof d.dados === 'object' && !Array.isArray(d.dados)) {
      d = d.dados
    } else if (d.resultado && typeof d.resultado === 'object' && !Array.isArray(d.resultado)) {
      d = d.resultado
    }

    var razaoSocial = String(d.razao_social || d.nome || d.nome_empresarial || '')
    var uf = String(d.uf || d.estado || defaultUf).toUpperCase()
    var situacaoPj = String(d.situacao_pj || d.situacao || d.situacao_cadastral || d.status || '')
    var updatedAt = String(d.updated_at || d.data || d.data_consulta || d.data_atualizacao || '')

    // Extract endereco from multiple possible response structures
    var endObj = {}
    if (d.endereco && typeof d.endereco === 'object') {
      endObj = d.endereco
    } else if (d.dados_endereco && typeof d.dados_endereco === 'object') {
      endObj = d.dados_endereco
    } else if (d.endereco_completo && typeof d.endereco_completo === 'object') {
      endObj = d.endereco_completo
    }

    // Build logradouro — combine tipo_logradouro + logradouro when both exist
    var tipoLog = String(endObj.tipo_logradouro || d.tipo_logradouro || '').trim()
    var nomeLog = String(
      endObj.logradouro || endObj.rua || endObj.endereco || d.logradouro || d.endereco || '',
    ).trim()
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
      numero: String(endObj.numero || endObj.num || d.numero || ''),
      complemento: String(endObj.complemento || d.complemento || ''),
      bairro: String(endObj.bairro || endObj.distrito || d.bairro || ''),
      municipio: String(
        endObj.municipio || endObj.cidade || endObj.municipio_nome || d.municipio || d.cidade || '',
      ),
      codigo_ibge: String(
        endObj.codigo_ibge ||
          endObj.codigo_municipio ||
          endObj.cod_ibge ||
          endObj.ibge ||
          d.codigo_ibge ||
          d.codigo_municipio ||
          '',
      ),
      cep: String(endObj.cep || d.cep || ''),
      uf: String(endObj.uf || endObj.estado || uf),
      pais: 'Brasil',
      codigo_pais: '1058',
    }

    // Extract inscricoes estaduais from multiple possible array keys
    var rawInscricoes = d.inscricoes_estaduais
    if (!Array.isArray(rawInscricoes)) {
      rawInscricoes = d.inscricoes || d.ies || d.inscricoesEstaduais || []
    }
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

      activeIes.push({
        inscricao_estadual: String(
          insc.inscricao_estadual || insc.ie || insc.numero || insc.numero_inscricao || '',
        ),
        tipo_ie: String(insc.tipo_ie || insc.tipo || insc.tipo_inscricao || 'Contribuinte'),
        ativa: true,
      })
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
      uf: uf,
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
