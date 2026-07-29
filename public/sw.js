var CACHE_NAME = '2a-rural-v1'
var PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/2arural192x192-6858d.png',
  '/src/assets/2arural512x512-224ac.png',
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS)
    }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME
          })
          .map(function (key) {
            return caches.delete(key)
          }),
      )
    }),
  )
  self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  var request = event.request
  if (request.method !== 'GET') return

  var url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var clone = response.clone()
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone)
          })
          return response
        })
        .catch(function () {
          return caches.match('/index.html')
        }),
    )
    return
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached
      return fetch(request)
        .then(function (response) {
          if (response.ok) {
            var clone = response.clone()
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, clone)
            })
          }
          return response
        })
        .catch(function () {
          return cached
        })
    }),
  )
})
