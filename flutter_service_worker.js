'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "5996f300655105e268ef6a4c306cad50",
"assets/FontManifest.json": "11a491405430337a3847f19ed733951c",
"assets/fonts/Far_ZarBd.ttf": "676c35435461994366108f1fba72baee",
"assets/fonts/IRANSansMobile.ttf": "550e81f9cd5c875d772e8a97e19bbef4",
"assets/fonts/IRANSansMobile_Bold.ttf": "9ee63b11af1c0c430e9e6c2b891fb6d3",
"assets/fonts/IRANSansMobile_Light.ttf": "7ce635c83b55037fcb912f959fa5f1b5",
"assets/fonts/IRANSansMobile_Medium.ttf": "6d051d5ba670aa673475309387ed6cc1",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/fonts/MizanARBold.otf": "5f82fd0303d072e747673953ff99bd72",
"assets/NOTICES": "a8fc641dedfc63a270c3e552bb5b7bfb",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/web/assets/fonts/IRANSansMobile_Bold.ttf": "9ee63b11af1c0c430e9e6c2b891fb6d3",
"assets/web/img/application.png": "749066f6359e0efd5b684e31f6e1e06e",
"assets/web/img/bg.jpg": "318987b47371feff88e70f742903c768",
"assets/web/img/bg2.jpg": "a24ccc1cc196a914b2640136dd7f5fae",
"assets/web/img/download.png": "9f2872d67ac5158b3ab3ec61121a20c8",
"assets/web/img/facebook.png": "2499976ba454d40d676eb0a3fa878066",
"assets/web/img/github.png": "01d067b4e5c95797c139cdd5bbc2da9f",
"assets/web/img/instagram.png": "8b2d4da1958f58a048d22394ac9c9b63",
"assets/web/img/linkedin.png": "8659bc867d10461e29bbf17b2504e846",
"assets/web/img/mee.jpg": "873fb7fb674ed14f2e68a9ebd5c57f2e",
"assets/web/img/resume.png": "975589f2cd59c2b31df0de4f82709e59",
"assets/web/img/stack.png": "b4a289ce0f5226b5dcd191bb162d7f40",
"assets/web/img/telegram.png": "bc9406e5bb5fe4228aed4d1ada5119ad",
"assets/web/img/telephone.png": "20a1407e10398e747994cc8f45e764d4",
"assets/web/img/twitter.png": "ec1f3d8a3f5d80ac0b9c21a4b964cd8b",
"img/application.png": "749066f6359e0efd5b684e31f6e1e06e",
"img/bg.jpg": "318987b47371feff88e70f742903c768",
"img/bg2.jpg": "a24ccc1cc196a914b2640136dd7f5fae",
"img/download.png": "9f2872d67ac5158b3ab3ec61121a20c8",
"img/facebook.png": "2499976ba454d40d676eb0a3fa878066",
"img/github.png": "01d067b4e5c95797c139cdd5bbc2da9f",
"img/instagram.png": "8b2d4da1958f58a048d22394ac9c9b63",
"img/linkedin.png": "8659bc867d10461e29bbf17b2504e846",
"img/mee.jpg": "873fb7fb674ed14f2e68a9ebd5c57f2e",
"img/resume.png": "975589f2cd59c2b31df0de4f82709e59",
"img/stack.png": "b4a289ce0f5226b5dcd191bb162d7f40",
"img/telegram.png": "bc9406e5bb5fe4228aed4d1ada5119ad",
"img/telephone.png": "20a1407e10398e747994cc8f45e764d4",
"img/twitter.png": "ec1f3d8a3f5d80ac0b9c21a4b964cd8b",
"index.html": "f0af1dafdcf32b1028ed53dd840be273",
"/": "f0af1dafdcf32b1028ed53dd840be273",
"main.dart.js": "e8a44fc286598c3258643ef3adeb0908",
"manifest.json": "b58fee5b630c0be11bd20b37cf74484d",
"version.json": "c20436e31e38d010786f17f5c458c55a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
