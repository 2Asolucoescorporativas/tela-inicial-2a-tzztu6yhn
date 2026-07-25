migrate(
  (app) => {
    try {
      const user = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'alexandre@2asolucoescorporativas.com.br',
      )
      const invoicesCol = app.findCollectionByNameOrId('invoices')

      const existing = app.findRecordsByFilter('invoices', "user_id = '" + user.id + "'", '', 1, 0)
      if (existing.length > 0) return

      const seedData = [
        {
          number: '000.001.204',
          series: '1',
          producer_name: 'Alexandre Silva - Fazenda Santa Luzia',
          cpf_cnpj: '123.456.789-00',
          ie_number: '209/0123456',
          recipient_name: 'Cooperativa Agropecuária Regional',
          recipient_document: '12.345.678/0001-90',
          operation_type: 'saida',
          total_value: 48500.0,
          status: 'emitida',
          chavenfe: '35260712345678900019055001000001204198273645',
          items_summary: '600 Sacas de Milho em Grão (60kg)',
        },
        {
          number: '000.001.203',
          series: '1',
          producer_name: 'Alexandre Silva - Fazenda Santa Luzia',
          cpf_cnpj: '123.456.789-00',
          ie_number: '209/0123456',
          recipient_name: 'Frigorífico Vale do Cerrado Ltda',
          recipient_document: '98.765.432/0001-10',
          operation_type: 'saida',
          total_value: 125000.0,
          status: 'emitida',
          chavenfe: '35260712345678900019055001000001203198273612',
          items_summary: '25 Cabeças de Gado Nelore Macho',
        },
        {
          number: '000.001.205',
          series: '1',
          producer_name: 'Alexandre Silva - Fazenda Santa Luzia',
          cpf_cnpj: '123.456.789-00',
          ie_number: '209/0123456',
          recipient_name: 'Laticínios Ouro Branco S/A',
          recipient_document: '45.678.901/0001-22',
          operation_type: 'saida',
          total_value: 18400.0,
          status: 'processando',
          chavenfe: '35260712345678900019055001000001205198273688',
          items_summary: '8.000 Litros de Leite In Natura',
        },
      ]

      for (const d of seedData) {
        const rec = new Record(invoicesCol)
        rec.set('user_id', user.id)
        rec.set('number', d.number)
        rec.set('series', d.series)
        rec.set('producer_name', d.producer_name)
        rec.set('cpf_cnpj', d.cpf_cnpj)
        rec.set('ie_number', d.ie_number)
        rec.set('recipient_name', d.recipient_name)
        rec.set('recipient_document', d.recipient_document)
        rec.set('operation_type', d.operation_type)
        rec.set('total_value', d.total_value)
        rec.set('status', d.status)
        rec.set('chavenfe', d.chavenfe)
        rec.set('items_summary', d.items_summary)
        app.save(rec)
      }
    } catch (_) {}
  },
  (app) => {},
)
