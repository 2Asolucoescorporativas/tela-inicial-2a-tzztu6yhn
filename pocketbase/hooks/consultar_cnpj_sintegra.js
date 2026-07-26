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
    var defaultUf = $secrets.get('SINTEGRA_EMPRESA_DEFAULT_UF') || 'PR'

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

    var d = res.json || {}

    var razaoSocial = String(d.razao_social || d.nome || '')
    var uf = String(d.uf || defaultUf).toUpperCase()
    var situacaoPj = String(d.situacao_pj || d.situacao || '')
    var updatedAt = String(d.updated_at || d.data || d.data_consulta || '')

    var endObj = d.endereco && typeof d.endereco === 'object' ? d.endereco : {}
    var endereco = {
      logradouro: String(endObj.logradouro || d.logradouro || ''),
      numero: String(endObj.numero || d.numero || ''),
      complemento: String(endObj.complemento || d.complemento || ''),
      bairro: String(endObj.bairro || d.bairro || ''),
      municipio: String(endObj.municipio || d.municipio || ''),
      codigo_ibge: String(endObj.codigo_ibge || endObj.codigo_municipio || d.codigo_ibge || ''),
      cep: String(endObj.cep || d.cep || ''),
      uf: String(endObj.uf || uf),
      pais: 'Brasil',
      codigo_pais: '1058',
    }

    var rawInscricoes = d.inscricoes_estaduais
    if (!Array.isArray(rawInscricoes)) rawInscricoes = []

    var activeIes = []
    for (var i = 0; i < rawInscricoes.length; i++) {
      var insc = rawInscricoes[i]
      if (!insc || typeof insc !== 'object') continue

      var situacaoVal = String(insc.situacao || insc.situacao_ie || insc.situacao_cadastral || '')
      var isAtiva =
        situacaoVal.toLowerCase() === 'ativa' || situacaoVal.toLowerCase() === 'habilitado'

      if (!isAtiva) continue

      activeIes.push({
        inscricao_estadual: String(insc.inscricao_estadual || insc.ie || insc.numero || ''),
        tipo_ie: String(insc.tipo_ie || insc.tipo || 'Contribuinte'),
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
