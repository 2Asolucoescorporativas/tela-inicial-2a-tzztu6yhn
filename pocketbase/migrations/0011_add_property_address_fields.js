migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('propriedades')

    if (!col.fields.getByName('numero')) {
      col.fields.add(new TextField({ name: 'numero' }))
    }
    if (!col.fields.getByName('bairro')) {
      col.fields.add(new TextField({ name: 'bairro' }))
    }
    if (!col.fields.getByName('cep')) {
      col.fields.add(new TextField({ name: 'cep' }))
    }

    app.save(col)

    app.db().newQuery("UPDATE propriedades SET numero = '' WHERE numero IS NULL").execute()
    app.db().newQuery("UPDATE propriedades SET bairro = '' WHERE bairro IS NULL").execute()
    app.db().newQuery("UPDATE propriedades SET cep = '' WHERE cep IS NULL").execute()
  },
  (app) => {
    var col = app.findCollectionByNameOrId('propriedades')

    if (col.fields.getByName('numero')) {
      col.fields.removeByName('numero')
    }
    if (col.fields.getByName('bairro')) {
      col.fields.removeByName('bairro')
    }
    if (col.fields.getByName('cep')) {
      col.fields.removeByName('cep')
    }

    app.save(col)
  },
)
