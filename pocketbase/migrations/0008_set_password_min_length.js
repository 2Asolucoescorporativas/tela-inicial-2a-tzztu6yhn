migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      if (col.passwordAuth) {
        col.passwordAuth.minPasswordLength = 6
        console.log('[migration 0008] minPasswordLength set to 6')
      } else {
        console.log('[migration 0008] passwordAuth not found, skipping')
      }
    } catch (err) {
      console.log('[migration 0008] error: ' + (err.message || err))
    }
    app.save(col)
  },
  (app) => {
    var col = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      if (col.passwordAuth) {
        col.passwordAuth.minPasswordLength = 8
      }
    } catch (err) {}
    app.save(col)
  },
)
