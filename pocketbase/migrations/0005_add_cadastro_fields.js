migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!col.fields.getByName('cadastro_concluido')) {
      col.fields.add(new BoolField({ name: 'cadastro_concluido' }))
    }
    if (!col.fields.getByName('senha_hash')) {
      col.fields.add(new TextField({ name: 'senha_hash' }))
    }
    if (!col.fields.getByName('data_cadastro_concluido')) {
      col.fields.add(new DateField({ name: 'data_cadastro_concluido' }))
    }
    if (!col.fields.getByName('data_criacao_senha')) {
      col.fields.add(new DateField({ name: 'data_criacao_senha' }))
    }
    if (!col.fields.getByName('data_ultima_alteracao_senha')) {
      col.fields.add(new DateField({ name: 'data_ultima_alteracao_senha' }))
    }
    app.save(col)

    try {
      var admin = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'alexandre@2asolucoescorporativas.com.br',
      )
      admin.set('cadastro_concluido', true)
      app.save(admin)
    } catch (_) {}
  },
  (app) => {
    var col = app.findCollectionByNameOrId('_pb_users_auth_')
    var fieldsToRemove = [
      'cadastro_concluido',
      'senha_hash',
      'data_cadastro_concluido',
      'data_criacao_senha',
      'data_ultima_alteracao_senha',
    ]
    fieldsToRemove.forEach(function (name) {
      var f = col.fields.getByName(name)
      if (f) col.fields.remove(f)
    })
    app.save(col)
  },
)
