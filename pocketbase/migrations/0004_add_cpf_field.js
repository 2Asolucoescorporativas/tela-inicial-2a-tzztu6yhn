migrate(
  (app) => {
    var usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!usersCol.fields.getByName('cpf')) {
      usersCol.fields.add(
        new TextField({
          name: 'cpf',
          required: true,
        }),
      )
    }
    app.save(usersCol)

    try {
      var user = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'alexandre@2asolucoescorporativas.com.br',
      )
      user.set('cpf', '00000000000')
      app.save(user)
    } catch (_) {}

    var col = app.findCollectionByNameOrId('_pb_users_auth_')
    col.addIndex('idx_users_cpf', true, 'cpf', "cpf != ''")
    app.save(col)
  },
  (app) => {
    var col = app.findCollectionByNameOrId('_pb_users_auth_')
    col.removeIndex('idx_users_cpf')
    var cpfField = col.fields.getByName('cpf')
    if (cpfField) col.fields.remove(cpfField)
    app.save(col)
  },
)
