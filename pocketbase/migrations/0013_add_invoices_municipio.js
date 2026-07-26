migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('invoices')
    if (!col.fields.getByName('municipio')) {
      col.fields.add(new TextField({ name: 'municipio' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('invoices')
    const field = col.fields.getByName('municipio')
    if (field) {
      col.fields.remove(field)
    }
    app.save(col)
  },
)
