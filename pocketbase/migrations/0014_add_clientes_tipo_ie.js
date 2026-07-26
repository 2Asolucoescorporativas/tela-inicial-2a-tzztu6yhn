migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    if (!col.fields.getByName('tipo_ie')) {
      col.fields.add(new TextField({ name: 'tipo_ie' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    const field = col.fields.getByName('tipo_ie')
    if (field) col.fields.remove(field)
    app.save(col)
  },
)
