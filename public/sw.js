var CACHE_NAME = '2a-rural-v14'
var CACHE_PREFIX = '2a-rural-'

var PRECACHE_URLS = ['/', '/2ARural192x192.png', '/2ARural512x512.png', '/manifest.json', '/login']

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS).catch(function () {})
      })
      .then(function () {
        return self.skipWaiting()
      })
      .catch(function () {}),
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE_NAME) {
              return caches.delete(key)
            }
          }),
        )
      })
      .then(function () {
        return self.clients.claim()
      })
      .catch(function () {}),
  )
})

self.addEventListener('fetch', function (event) {
  var request = event.request

  if (request.method !== 'GET') return

  var url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  var isNavigation =
    request.mode === 'navigate' || (request.headers.get('accept') || '').indexOf('text/html') !== -1

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone()
          caches
            .open(CACHE_NAME)
            .then(function (cache) {
              cache.put(request, copy).catch(function () {})
            })
            .catch(function () {})
          return response
        })
        .catch(function () {
          return caches
            .match(request)
            .then(function (cached) {
              if (cached) return cached
              return caches.match('/login').then(function (loginCached) {
                if (loginCached) return loginCached
                return new Response(
                  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#002C45;color:#fff;"><div style="text-align:center;"><h1>Você está offline</h1><p>Verifique sua conexão e tente novamente.</p></div></body></html>',
                  { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
                )
              })
            })
            .catch(function () {
              return new Response(
                '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#002C45;color:#fff;"><div style="text-align:center;"><h1>Você está offline</h1><p>Verifique sua conexão e tente novamente.</p></div></body></html>',
                { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
              )
            })
        }),
    )
    return
  }

  event.respondWith(
    caches
      .match(request)
      .then(function (cached) {
        if (cached) {
          fetch(request)
            .then(function (response) {
              if (response && response.status === 200) {
                var copy = response.clone()
                caches
                  .open(CACHE_NAME)
                  .then(function (cache) {
                    cache.put(request, copy).catch(function () {})
                  })
                  .catch(function () {})
              }
            })
            .catch(function () {})
          return cached
        }

        return fetch(request)
          .then(function (response) {
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response
            }
            var copy = response.clone()
            caches
              .open(CACHE_NAME)
              .then(function (cache) {
                cache.put(request, copy).catch(function () {})
              })
              .catch(function () {})
            return response
          })
          .catch(function () {
            return new Response('', { status: 200, statusText: 'OK' })
          })
      })
      .catch(function () {
        return new Response('', { status: 200, statusText: 'OK' })
      }),
  )
})

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
