migrate(
  (app) => {
    const collection = new Collection({
      name: 'invoices',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'number', type: 'text', required: true },
        { name: 'series', type: 'text', required: true },
        { name: 'producer_name', type: 'text', required: true },
        { name: 'cpf_cnpj', type: 'text', required: true },
        { name: 'ie_number', type: 'text' },
        { name: 'recipient_name', type: 'text', required: true },
        { name: 'recipient_document', type: 'text', required: true },
        {
          name: 'operation_type',
          type: 'select',
          required: true,
          values: ['saida', 'entrada'],
          maxSelect: 1,
        },
        { name: 'total_value', type: 'number', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['emitida', 'processando', 'cancelada', 'rascunho'],
          maxSelect: 1,
        },
        { name: 'chavenfe', type: 'text' },
        { name: 'items_summary', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_invoices_user ON invoices (user_id)',
        'CREATE INDEX idx_invoices_status ON invoices (status)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('invoices')
    app.delete(collection)
  },
)
