const C='yumy-079';
const CORE=['./','index.html','style.css','game.js','manifest.webmanifest',
'assets/icon-192.png','assets/icon-512.png','assets/reef_background.png','assets/kelp_background.png','assets/volcanic_background.png','assets/abyss_background.png',
'assets/player_0.png','assets/player_1.png','assets/player_2.png','assets/player_3.png','assets/player_4.png','assets/player_5.png','assets/player_6.png','assets/player_7.png',
'assets/minnow.png','assets/yellow-tang.png','assets/blue-tang.png','assets/clownfish.png','assets/grouper.png','assets/lionfish.png','assets/shark.png','assets/manta.png','assets/seahorse.png','assets/manta_0.png','assets/manta_1.png','assets/manta_2.png','assets/manta_3.png','assets/manta_4.png','assets/manta_5.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('yumy-')&&k!==C).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
