var CACHE_NAME = '2a-rural-v5'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache
        .addAll(['/icons/icon-192.svg', '/icons/icon-512.svg', '/manifest.json'])
        .catch(function () {})
    }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            return caches.delete(key)
          }),
        )
      })
      .then(function () {
        return self.clients.claim()
      }),
  )
})

self.addEventListener('fetch', function (event) {
  var request = event.request
  if (request.method !== 'GET') return

  var url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(fetch(request))
})
