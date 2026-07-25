routerAdd(
  'GET',
  '/backend/v1/invoices/next-number',
  (e) => {
    const userId = e.auth?.id
    if (!userId) return e.unauthorizedError('Autenticação necessária')

    const records = $app.findRecordsByFilter(
      'invoices',
      "user_id = '" + userId + "'",
      '-created',
      1,
      0,
    )
    let nextNum = 1206
    if (records.length > 0) {
      const lastNumStr = records[0].getString('number').replace(/\./g, '')
      const parsed = parseInt(lastNumStr, 10)
      if (!isNaN(parsed) && parsed > 0) {
        nextNum = parsed + 1
      }
    }

    const str = String(nextNum).padStart(9, '0')
    const formatted = `${str.slice(0, 3)}.${str.slice(3, 6)}.${str.slice(6)}`
    return e.json(200, { nextNumber: formatted, series: '1' })
  },
  $apis.requireAuth(),
)
