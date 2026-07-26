migrate(
  (app) => {
    const collection = new Collection({
      name: 'clientes',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'tipo_pessoa', type: 'select', required: true, values: ['FISICA', 'JURIDICA'] },
        { name: 'cpf_cnpj', type: 'text', required: true },
        { name: 'nome_razao_social', type: 'text', required: true },
        { name: 'nome_fantasia', type: 'text' },
        { name: 'indicador_ie', type: 'text' },
        { name: 'inscricao_estadual', type: 'text' },
        { name: 'cep', type: 'text' },
        { name: 'logradouro', type: 'text' },
        { name: 'numero', type: 'text' },
        { name: 'complemento', type: 'text' },
        { name: 'bairro', type: 'text' },
        { name: 'municipio', type: 'text' },
        { name: 'codigo_ibge', type: 'text' },
        { name: 'uf', type: 'text' },
        { name: 'pais', type: 'text' },
        { name: 'codigo_pais', type: 'text' },
        { name: 'telefone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_clientes_user_cpf_cnpj ON clientes (user_id, cpf_cnpj)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('clientes')
    app.delete(collection)
  },
)
