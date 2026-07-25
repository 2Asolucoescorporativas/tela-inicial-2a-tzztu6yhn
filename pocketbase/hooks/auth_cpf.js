routerAdd('POST', '/backend/v1/auth/cpf', (e) => {
  var body = e.requestInfo().body || {}
  var cpf = String(body.cpf || '').replace(/\D/g, '')
  var password = String(body.password || '')

  if (!cpf || !password) {
    return e.json(400, { error: 'CPF e senha são obrigatórios' })
  }

  var user
  try {
    user = $app.findFirstRecordByFilter('_pb_users_auth_', "cpf = '" + cpf + "'")
  } catch (err) {
    return e.json(401, { error: 'CPF ou senha inválidos' })
  }

  var valid = false
  try {
    valid = user.validatePassword(password)
  } catch (err) {
    return e.json(500, { error: 'Erro interno de autenticação' })
  }

  if (!valid) {
    return e.json(401, { error: 'CPF ou senha inválidos' })
  }

  return $apis.recordAuthResponse(e, user)
})
