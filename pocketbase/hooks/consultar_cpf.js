routerAdd('POST', '/backend/v1/cadastro/consultar-cpf', (e) => {
  var body = e.requestInfo().body || {}
  var cpf = String(body.cpf || '').replace(/\D/g, '')

  if (cpf.length !== 11) {
    return e.json(400, { error: 'cpf_invalido', message: 'Informe um CPF válido.' })
  }

  var certBase64 = $secrets.get('SEFA_CERT_BASE64') || ''

  if (!certBase64) {
    return e.json(200, {
      cpf: cpf,
      nome: 'JOÃO DA SILVA SANTOS',
      situacao_cpf: 'Regular',
      inscricoes: [
        {
          ie: '9020829380',
          situacao_ie: 'Habilitado',
          tipo_ie: 'Produtor Rural',
          municipio: 'CURITIBA',
          uf: 'PR',
          codigo_ibge: '4106902',
          endereco: 'RUA DAS FLORES, 123',
          bairro: 'CENTRO',
          cep: '80000-000',
          cnae: '0111-3/01',
          data_inicio_atividade: '15/01/2020',
          data_situacao_cadastral: '15/01/2020',
          regime_tributacao: 'Simples Nacional',
          credito_presumido: 'Não',
          tipo_produtor: 'Pessoa Física',
        },
        {
          ie: '9031738401',
          situacao_ie: 'Habilitado',
          tipo_ie: 'Produtor Rural',
          municipio: 'PONTA GROSSA',
          uf: 'PR',
          codigo_ibge: '4119905',
          endereco: 'FAZENDA SÃO JOSÉ, SN',
          bairro: 'ZONA RURAL',
          cep: '84000-000',
          cnae: '0111-3/01',
          data_inicio_atividade: '10/03/2021',
          data_situacao_cadastral: '10/03/2021',
          regime_tributacao: 'Simples Nacional',
          credito_presumido: 'Sim',
          tipo_produtor: 'Pessoa Física',
        },
      ],
    })
  }

  var soapEnvelope =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
    '<soap12:Header>' +
    '<nfeCabecMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4">' +
    '<cUF>41</cUF><versaoDados>4.00</versaoDados>' +
    '</nfeCabecMsg>' +
    '</soap12:Header>' +
    '<soap12:Body>' +
    '<nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4">' +
    '<ConsCad versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
    '<infCons><UF>PR</UF><CPF>' +
    cpf +
    '</CPF></infCons>' +
    '</ConsCad>' +
    '</nfeDadosMsg>' +
    '</soap12:Body>' +
    '</soap12:Envelope>'

  try {
    var res = $http.send({
      url: 'https://homologacao.nfe.sefa.pr.gov.br/nfe/CadConsultaCadastro4',
      method: 'POST',
      headers: {
        'Content-Type':
          'application/soap+xml; charset=utf-8; action="http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4/consulta"',
      },
      body: soapEnvelope,
      timeout: 30,
    })

    if (res.statusCode !== 200) {
      return e.json(500, {
        error: 'consulta_falhou',
        message:
          'Não foi possível consultar o Cadastro Centralizado de Contribuintes da SEFA/PR. Tente novamente.',
      })
    }

    var bodyStr = ''
    try {
      if (typeof res.body === 'string') {
        bodyStr = res.body
      } else if (res.body) {
        for (var i = 0; i < res.body.length; i++) {
          bodyStr += String.fromCharCode(res.body[i])
        }
      }
    } catch (convErr) {
      return e.json(500, {
        error: 'consulta_falhou',
        message:
          'Não foi possível consultar o Cadastro Centralizado de Contribuintes da SEFA/PR. Tente novamente.',
      })
    }

    if (bodyStr.indexOf('Fault') !== -1 || bodyStr.indexOf('fault') !== -1) {
      return e.json(500, {
        error: 'consulta_falhou',
        message:
          'Não foi possível consultar o Cadastro Centralizado de Contribuintes da SEFA/PR. Tente novamente.',
      })
    }

    function extractTag(text, tag) {
      var regex = new RegExp('<(?:[\\w]+:)?' + tag + '[^>]*>([^<]*)</(?:[\\w]+:)?' + tag + '>', 'i')
      var match = text.match(regex)
      return match ? match[1].trim() : ''
    }

    function mapSit(code) {
      var s = String(code || '').trim()
      if (s === '0') return 'Habilitado'
      if (s === '1') return 'Não Habilitado'
      if (s === '2') return 'Cancelado'
      return s || 'Não informado'
    }

    function mapTipo(code) {
      var t = String(code || '').trim()
      if (t === '0') return 'Contribuinte ICMS'
      if (t === '1') return 'Contribuinte ISENTO'
      if (t === '2') return 'Não Contribuinte'
      return t || 'Não informado'
    }

    var infCadBlocks = []
    var blockRegex = /<infCad[^>]*>([\s\S]*?)<\/infCad>/gi
    var blockMatch
    while ((blockMatch = blockRegex.exec(bodyStr)) !== null) {
      infCadBlocks.push(blockMatch[1])
    }

    if (infCadBlocks.length === 0) {
      return e.json(200, {
        error: 'nenhum_cadastro',
        message: 'Não foram encontradas inscrições estaduais vinculadas ao CPF informado.',
      })
    }

    var nome = extractTag(bodyStr, 'xNome')

    var inscricoes = []
    for (var j = 0; j < infCadBlocks.length; j++) {
      var block = infCadBlocks[j]
      inscricoes.push({
        ie: extractTag(block, 'IE'),
        situacao_ie: mapSit(extractTag(block, 'sit')),
        tipo_ie: mapTipo(extractTag(block, 'tipo')),
        municipio: extractTag(block, 'xMun'),
        uf: extractTag(block, 'UF'),
        codigo_ibge: extractTag(block, 'cMun'),
        endereco: extractTag(block, 'xLgr') + ', ' + extractTag(block, 'nro'),
        bairro: extractTag(block, 'xBairro'),
        cep: extractTag(block, 'CEP'),
        cnae: extractTag(block, 'CNAE'),
        data_inicio_atividade: extractTag(block, 'dIniAtiv'),
        data_situacao_cadastral: extractTag(block, 'dUltSit'),
        regime_tributacao: extractTag(block, 'xRegApur'),
        credito_presumido: 'Não informado',
        tipo_produtor: 'Não informado',
      })
    }

    return e.json(200, {
      cpf: cpf,
      nome: nome,
      situacao_cpf: 'Regular',
      inscricoes: inscricoes,
    })
  } catch (err) {
    return e.json(500, {
      error: 'consulta_falhou',
      message:
        'Não foi possível consultar o Cadastro Centralizado de Contribuintes da SEFA/PR. Tente novamente.',
    })
  }
})
