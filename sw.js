const CACHE_NAME = 'static-v1';
const dynamicCacheName = 'dynamic-v1';

const assets = [
  '/index.html',
  '/pages/login.html',
  '/pages/register.html'
];

// install service worker
self.addEventListener('install', event => {
  console.log('Service worker has been installed');
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(assets);

    self.skipWaiting(); // Activated immediately

  })());
});

// activate event
self.addEventListener('activate', event => {
  console.log('Service worker has been activated');
  event.waitUntil((async () => {

    await self.clients.claim();

    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
        return null;
      })
    );
  })());
});


// fetch event
self.addEventListener('fetch', event => {
  // console.log('Fetch event:', event);

  event.respondWith((async () => {
    try {
      // First, try fetching from the network
      const fetchResponse = await fetch(event.request);

      // If successful, clone the response and cache it
      if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
        const cache = await caches.open(dynamicCacheName);
        cache.put(event.request, fetchResponse.clone());
        limitCacheSize(dynamicCacheName, 50);
      }

      return fetchResponse;
    } catch (error) {
      console.error('Fetch failed, trying cache:', error);

      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      } else {
        // Check dynamic cache for the requested resource
        const dynamicCache = await caches.open(dynamicCacheName);
        const cachedDynamicResponse = await dynamicCache.match(event.request);
        return cachedDynamicResponse || caches.match('/ecs-vw-gis/offline');
      }
    }
  })());
});

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        //console.log("... item deleted." + size);
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};


// *** Notification  *** //
self.addEventListener('notificationclick', function (event) {
  // Bildirime tıklandığında yapılacak işlemler
  console.log("Notification wurde geklickt");

  event.notification.close(); // Bildirimi kapat

   // Kullanıcıya yönlendirme yapabilirsiniz
   event.waitUntil(
    clients.openWindow('https://www.google.com')
  );

  console.log("Notification wurde geklickt");
});

self.addEventListener('notificationclose', function (event) {
  // Bildirim kapatıldığında yapılacak işlemler
  console.log('Notification wurde geschlossen');
});






// // fetch event
// self.addEventListener('fetch', event => {
//   console.log('Fetch event:', event);

//   event.respondWith((async () => {
//     const cache = await caches.open(CACHE_NAME);

//     // Check the cache first
//     const cachedResponse = await cache.match(event.request);
//     if (cachedResponse) {
//       return cachedResponse;
//     } else {
//       try {
//         // Fetch from the network
//         const fetchResponse = await fetch(event.request);

//         // Cache only successful responses (status 200) and basic requests
//         if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
//           // Clone the response and cache it in the dynamic cache
//           const dynamicCache = await caches.open(dynamicCacheName);
//           const responseToCache = fetchResponse.clone();
//           dynamicCache.put(event.request, responseToCache);
//           limitCacheSize(dynamicCacheName, 50); // dynamic cache size  is 50
//         }

//         return fetchResponse;
//       } catch (error) {
//       console,log("uygulama server da ayakta degil");

//         console.error('Fetch failed:', error);

//         // Try to fetch from the dynamic cache on network failure
//         const dynamicCache = await caches.open(dynamicCacheName);
//         const cachedDynamicResponse = await dynamicCache.match(event.request);
//         if (cachedDynamicResponse) {
//           return cachedDynamicResponse;
//         } else {
//           // If not found in both caches, fallback to offline.html
//           return caches.match('/ecs-vw-gis/offline');
//         }
//       }
//     }
//   })());
// });



