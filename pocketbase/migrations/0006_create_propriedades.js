migrate(
  (app) => {
    var usersId = '_pb_users_auth_'

    var collection = new Collection({
      name: 'propriedades',
      type: 'base',
      listRule: '@request.auth.id != "" && usuario_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && usuario_id = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != "" && usuario_id = @request.auth.id',
      deleteRule: '@request.auth.id != "" && usuario_id = @request.auth.id',
      fields: [
        {
          name: 'usuario_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'nome', type: 'text', required: true, min: 3, max: 50 },
        { name: 'nome_normalizado', type: 'text', required: true },
        { name: 'inscricao_estadual', type: 'text', required: true },
        { name: 'situacao_ie', type: 'text' },
        { name: 'tipo_ie', type: 'text' },
        { name: 'municipio', type: 'text' },
        { name: 'codigo_ibge', type: 'text' },
        { name: 'uf', type: 'text' },
        { name: 'endereco', type: 'text' },
        { name: 'cnae', type: 'text' },
        { name: 'tipo_produtor', type: 'text' },
        { name: 'ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_prop_usuario_nome ON propriedades (usuario_id, nome_normalizado)',
        'CREATE UNIQUE INDEX idx_prop_usuario_ie ON propriedades (usuario_id, inscricao_estadual)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    var collection = app.findCollectionByNameOrId('propriedades')
    app.delete(collection)
  },
)
