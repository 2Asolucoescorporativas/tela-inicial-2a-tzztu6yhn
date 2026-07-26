migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('consultas')

    if (!col.fields.getByName('uf_consultada')) {
      col.fields.add(new TextField({ name: 'uf_consultada' }))
    }
    if (!col.fields.getByName('nome')) {
      col.fields.add(new TextField({ name: 'nome' }))
    }
    if (!col.fields.getByName('resultado_normalizado')) {
      col.fields.add(new TextField({ name: 'resultado_normalizado' }))
    }
    if (!col.fields.getByName('origem')) {
      col.fields.add(new TextField({ name: 'origem' }))
    }
    if (!col.fields.getByName('origem_cache')) {
      col.fields.add(new BoolField({ name: 'origem_cache' }))
    }
    if (!col.fields.getByName('data_expiracao')) {
      col.fields.add(new DateField({ name: 'data_expiracao' }))
    }
    if (!col.fields.getByName('ip_origem')) {
      col.fields.add(new TextField({ name: 'ip_origem' }))
    }

    app.save(col)
  },
  (app) => {
    var col = app.findCollectionByNameOrId('consultas')
    var fieldsToRemove = [
      'uf_consultada',
      'nome',
      'resultado_normalizado',
      'origem',
      'origem_cache',
      'data_expiracao',
      'ip_origem',
    ]
    fieldsToRemove.forEach(function (name) {
      var f = col.fields.getByName(name)
      if (f) col.fields.remove(f)
    })
    app.save(col)
  },
)
