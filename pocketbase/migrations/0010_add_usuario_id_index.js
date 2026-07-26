migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('propriedades')
    col.addIndex('idx_prop_usuario_id', false, 'usuario_id', '')
    app.save(col)
  },
  (app) => {
    var col = app.findCollectionByNameOrId('propriedades')
    col.removeIndex('idx_prop_usuario_id')
    app.save(col)
  },
)
