let restaurantCache = 'mycache';

let cacheFiles = [
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    'https://fonts.googleapis.com/css?family=Roboto'
];

self.addEventListener('install', function(e) {
    console.log("ServiceWorker is Installed")
    e.waitUntil( //hold the service worker until following tasks are completed
        caches.open(restaurantCache).then(function(cache) {
            console.log("Caching cacheFiles");
            return cache.addAll(cacheFiles);        
        })
        .catch(function(err) {
            console.log('[ServiceWorker] falied open the Cach ', err);
        })
    )
});

self.addEventListener('activate', function(e) { 
    console.log("new ServiceWorker has been Activated");
    e.waitUntil( // 
        caches.keys().then(function(cacheNames){    //.keys() will give all cache names
            return Promise.all(cacheNames.filter(function(cacheName) { // wraps all promises in Promis.all() and wait for its completion
                return cacheName.startsWith('restaurant-') && cacheName != restaurantCache;}) //  update the database
                .map(function(cacheName){ //map and
                    return caches.delete(cacheName); // delete outdated caches
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) { 
    console.log('Fetch by ServiceWorker', event.request.url);
    event.respondWith( // searching for match in caches for request
      caches.open('mycache').then(function (cache) {
        return caches.match(event.request).then(function (res) { 
            return res || fetch(event.request).then(function (response) {
                  cache.put(event.request, response.clone()); 
                  console.log('New Data Cached', event.request.url);
                  return response;
          });
        });
      })
      .catch(function(err) {
        console.log('Error in Fetching & Caching New Data', err);
        })
    );
});