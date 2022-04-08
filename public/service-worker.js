'use strict';

// Source : https://blog.logrocket.com/building-a-pwa-with-svelte/

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-2022_02_08-v1';

// Add list of files to cache here.
const FILES_TO_CACHE = [
    // Page, CSS et JS
    '/offline.html',
    '/global.css',
    '/favicon.png',
    '/build/bundle.css',
    '/build/bundle.js',

    // Polices
    '/fonts/Quartz/Quartz.eot',
    '/fonts/Quartz/Quartz.svg',
    '/fonts/Quartz/Quartz.ttf',
    '/fonts/Quartz/Quartz.woff',

    // Icones
    '/assets/pwa-icons/icon-32x32.png',
    '/assets/pwa-icons/icon-128x128.png',
    '/assets/pwa-icons/icon-144x144.png',
    '/assets/pwa-icons/icon-152x152.png',
    '/assets/pwa-icons/icon-192x192.png',
    '/assets/pwa-icons/icon-256x256.png',
    '/assets/pwa-icons/icon-512x512.png',
    '/assets/pwa-icons/maskable_icon.png',

    // Logos des moteurs de recherche
    '/assets/search-engines/bing.png',
    '/assets/search-engines/duckduckgo.png',
    '/assets/search-engines/ecosia.png',
    '/assets/search-engines/google.png',
    '/assets/search-engines/lilo.png',
    '/assets/search-engines/qwant.png',
    '/assets/search-engines/yandex.png',
];

// Installation du SW
self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // Add fetch event handler here.
    /*if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );*/
    evt.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        // Try the cache first.
        const cachedResponse = await cache.match(evt.request);
        if (cachedResponse !== undefined) {
            // Cache hit, let's send the cached resource.
            return cachedResponse;
        } else {
            // Nothing in cache, let's go to the network.

            // ...... truncated ....
        }
    }
});
