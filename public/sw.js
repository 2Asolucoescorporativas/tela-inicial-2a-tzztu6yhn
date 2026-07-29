var CACHE_NAME = '2a-rural-v3'

var PRECACHE_URLS = ['/', '/index.html', '/manifest.json']

self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS).catch(function () {})
    }),
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE_NAME
            })
            .map(function (key) {
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

  event.respondWith(
    fetch(request)
      .then(function (response) {
        if (response.ok) {
          var clone = response.clone()
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone).catch(function () {})
          })
        }
        return response
      })
      .catch(function () {
        return caches.match(request).then(function (cached) {
          if (cached) return cached
          if (request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          return new Response('', { status: 504, statusText: 'Offline' })
        })
      }),
  )
})
