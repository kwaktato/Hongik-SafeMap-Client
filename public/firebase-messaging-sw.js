importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

const firebaseConfig = {
  apiKey: 'AIzaSyDsM4hePgL7i58NCZvInHGxB5hbX75Q2bY',
  authDomain: 'safemap-472fd.firebaseapp.com',
  projectId: 'safemap-472fd',
  storageBucket: 'safemap-472fd.firebasestorage.app',
  messagingSenderId: '931327955321',
  appId: '1:931327955321:web:0fa76a03c989d3ff835fa8',
  measurementId: 'G-T6YBR8E44Y',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// // 서비스 워커 설치 시 실행, 주로 리소스 캐싱이나 초기화 작업
// self.addEventListener('install', function () {
//   self.skipWaiting();
// });

// // 활성화 단계, 불필요한 리소스 정리
// self.addEventListener('activate', function () {
//   console.log('fcm sw activate..');
// });

// // 푸시 알림 수신 시 실행, 사용자에게 알림 표시
// self.addEventListener('push', function (e) {
//   if (!e.data.json()) return;
//   const resultData = e.data.json().notification;
//   const notificationTitle = resultData.title;
//   const notificationOptions = {
//     body: resultData.body,
//     data: resultData.data,
//   };

//   e.waitUntil(
//     self.registration.showNotification(notificationTitle, notificationOptions),
//   );
// });

// // 사용자가 알림을 클릭했을 때 실행, 특정 작업 수행
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   const urlToOpen = event.notification.data;
//   event.waitUntil(self.clients.openWindow(urlToOpen));
// });

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png',
    data: payload.data?.url || '/', // 클릭 시 이동할 경로
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data));
});
