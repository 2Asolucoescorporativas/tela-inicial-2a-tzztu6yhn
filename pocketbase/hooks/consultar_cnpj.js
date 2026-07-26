routerAdd(
  'GET',
  '/backend/v1/consultar-cnpj/{cnpj}',
  (e) => {
    const cnpjRaw = e.request.pathValue('cnpj')
    const cnpj = (cnpjRaw || '').replace(/\D/g, '')
    if (cnpj.length !== 14) {
      return e.badRequestError('CNPJ inválido: deve conter 14 dígitos')
    }

    let res
    try {
      res = $http.send({
        url: 'https://brasilapi.com.br/api/cnpj/v1/' + cnpj,
        method: 'GET',
        timeout: 15,
      })
    } catch (err) {
      return e.json(502, { error: 'Erro ao consultar API de CNPJ' })
    }

    if (res.statusCode === 404 || res.statusCode === 400) {
      return e.json(404, { error: 'CNPJ não encontrado' })
    }
    if (res.statusCode !== 200) {
      return e.json(502, { error: 'Erro ao consultar API de CNPJ' })
    }

    const d = res.json || {}
    const end = d.endereco || {}

    var logradouro = end.logradouro || d.logradouro || ''
    var tipoLog = end.tipo_logradouro || d.tipo_logradouro || ''
    if (tipoLog && logradouro) {
      logradouro = tipoLog + ' ' + logradouro
    }

    return e.json(200, {
      cpf_cnpj: d.cnpj || cnpj,
      nome_razao_social: d.razao_social || '',
      nome_fantasia: d.nome_fantasia || '',
      indicador_ie: '9',
      inscricao_estadual: '',
      cep: end.cep || d.cep || '',
      logradouro: logradouro,
      numero: end.numero || d.numero || '',
      complemento: end.complemento || d.complemento || '',
      bairro: end.bairro || d.bairro || '',
      municipio: end.municipio || d.municipio || '',
      codigo_ibge: end.codigo_municipio || d.codigo_municipio || '',
      uf: end.uf || d.uf || '',
      pais: 'Brasil',
      codigo_pais: '1058',
      telefone: d.telefone || '',
      email: d.correio_eletronico || '',
    })
  },
  $apis.requireAuth(),
)
