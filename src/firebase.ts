// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDsM4hePgL7i58NCZvInHGxB5hbX75Q2bY',
  authDomain: 'safemap-472fd.firebaseapp.com',
  projectId: 'safemap-472fd',
  storageBucket: 'safemap-472fd.firebasestorage.app',
  messagingSenderId: '931327955321',
  appId: '1:931327955321:web:0fa76a03c989d3ff835fa8',
  measurementId: 'G-T6YBR8E44Y',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// export const requestForToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       const token = await getToken(messaging, {
//         vapidKey: '백엔드나_콘솔에서_받은_VAPID_KEY',
//       });
//       if (token) {
//         console.log('FCM 토큰 발급 완료:', token);
//         return token;
//       }
//     } else {
//       console.log('알림 권한 거부됨');
//     }
//   } catch (error) {
//     console.error('토큰 발급 실패:', error);
//   }
// };

// async function registerServiceWorker() {
//   try {
//     const registration = await navigator.serviceWorker.register(
//       'firebase-messaging-sw.js',
//     );
//     console.log('Service Worker 등록 성공:', registration);
//   } catch (error) {
//     console.log('Service Worker 등록 실패:', error);
//   }
// }

// async function retryGetDeviceToken(retries: number): Promise<string> {
//   try {
//     return await getDeviceToken();
//   } catch (error) {
//     if (retries === 0) {
//       console.error('최대 재시도 횟수 초과:', error);
//       throw error;
//     } else {
//       console.warn(`getDeviceToken 재시도 중... 남은 횟수: ${retries}`);
//       return retryGetDeviceToken(retries - 1);
//     }
//   }
// }

// export async function handleAllowNotification() {
//   if (Notification.permission === 'default') {
//     const status = await Notification.requestPermission();
//     if (status === 'denied') {
//       return 'denied';
//     } else if (status === 'granted') {
//       try {
//         // 서비스 워커 등록 완료를 기다림
//         await registerServiceWorker();
//         const token = await retryGetDeviceToken(3); // 최대 3번까지 재시도
//         await postDeviceToken(token);
//         return 'granted';
//       } catch (error) {
//         console.error(error);
//         throw error;
//       }
//     } else {
//       return 'default';
//     }
//   } else {
//     return 'exist Notification type';
//   }
// }

// async function getDeviceToken(): Promise<string> {
//   const token = await getToken(messaging, {
//     vapidKey:
//       'BDWqjpTrhAoAsx9cIHta-8DLOCkCL49xCI-W1ygu1Vr7ilj0c1rWewLVRgm2QklK__Of08Wl9WJ7smBL57MqUU4',
//   });
//   return token;
// }

export const handleAllowNotification = async () => {
  try {
    const status = await Notification.requestPermission();

    if (status === 'granted') {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      );

      const token = await getToken(messaging, {
        vapidKey:
          'BDWqjpTrhAoAsx9cIHta-8DLOCkCL49xCI-W1ygu1Vr7ilj0c1rWewLVRgm2QklK__Of08Wl9WJ7smBL57MqUU4',
        serviceWorkerRegistration: registration,
      });

      return token;
    }
  } catch (error) {
    console.error('Notification Error:', error);
    throw error;
  }
};
