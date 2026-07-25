migrate(
  (app) => {
    var collection = new Collection({
      name: 'consultas',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'cpf', type: 'text', required: true },
        { name: 'consulta_id', type: 'text', required: true },
        { name: 'resultado_json', type: 'text', required: true },
        { name: 'utilizada', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_consultas_id ON consultas (consulta_id)',
        'CREATE INDEX idx_consultas_cpf ON consultas (cpf)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    var collection = app.findCollectionByNameOrId('consultas')
    app.delete(collection)
  },
)
