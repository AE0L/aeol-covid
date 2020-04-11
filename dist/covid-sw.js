const CACHE = 'aeol-covid-offline-cache-1'

const PRE_CACHE = [
    '/',
    '/build.css',
    '/bundle.js',
    '/css/fonts_icons.css',
    '/fonts/MaterialIcons-Regular.eot',
    '/fonts/MaterialIcons-Regular.ttf',
    '/fonts/MaterialIcons-Regular.woff',
    '/fonts/MaterialIcons-Regular.woff2',
    '/fonts/muli-v20-latin-regular.woff',
    '/fonts/muli-v20-latin-regular.woff2',
    '/fonts/muli-v20-latin-regular.eot',
    '/fonts/muli-v20-latin-regular.ttf',
    '/fonts/muli-v20-latin-regular.svg',
]

const OFFLINE_FALLBACK_PAGE = '/'

const DO_NOT_CACHE = [
    /\/__webpack_hmr/,
    /\/*.hot-update.json/
]

const NETWORK_FIRST = [
    /\/covid\/.*/
]

const is_match         = (req, path) => req.match(new RegExp(path))
const compare          = (req, paths) => !req ? false : paths.some(path => is_match(req, path))
const is_network_first = (req) => compare(req, NETWORK_FIRST)
const is_do_not_cache  = (req) => compare(req, DO_NOT_CACHE)

self.addEventListener('message', (evt) => {
    if (evt.data.action === 'skipWaiting') {
        self.skipWaiting()
    }
})


self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll(PRE_CACHE).then(() => {
                return cache.add(OFFLINE_FALLBACK_PAGE)
            })
        })
    )
})


self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then(keys => Promise.all(keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key)),
            self.clients.claim()
        ))
    )
})


self.addEventListener('fetch', (evt) => {
    if (evt.request.method !== 'GET') {
        return
    }

    if (is_network_first(evt.request.url)) {
        network_first_fetch(evt)
    } else {
        cache_first_fetch(evt)
    }
})


function network_first_fetch(evt) {
    evt.respondWith(fetch(evt.request)
        .then(res => {

            evt.waitUntil(update_cache(evt.request, res.clone()))

            return res
        })
        .catch(err => {
            const cache_req = from_cache(evt.request)

            return cache_req
        })
    )
}


function cache_first_fetch(evt) {
    evt.respondWith(
        from_cache(evt.request).then(
            function(res) {
                evt.waitUntil(
                    fetch(evt.request).then(function(res) {
                        return update_cache(evt.request, res)
                    })
                )

                return res
            },

            function() {
                return fetch(evt.request)
                    .then(function(res) {
                        evt.waitUntil(update_cache(evt.request, res.clone()))

                        return res
                    })
                    .catch(function(err) {
                        if (evt.request.destination !== 'document' || evt.request.mode !== 'navigate') {
                            return
                        }

                        return caches.open(CACHE).then(cache => {
                            return cache.match(OFFLINE_FALLBACK_PAGE)
                        })
                    })
            }
        )
    )
}


function from_cache(req) {

    return caches.open(CACHE).then(cache => {
        return cache.match(req).then(matching => {
            if (!matching || matching.status === 404) {
                return Promise.reject('not in cache')
            }

            return matching
        })
    })
}


function update_cache(req, res) {
    if (!is_do_not_cache(req.url)) {
        return caches.open(CACHE).then(cache => {
            return cache.put(req, res)
        })
    }

    return Promise.resolve()
}