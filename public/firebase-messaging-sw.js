// Import and configure the Firebase SDK
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// These values should match your firebaseConfig in src/services/firebase.ts
// Note: In a production app, you might want to inject these via build process
firebase.initializeApp({
  apiKey: "AIzaSyAWkv4e7wnAB3GZuUf11JiOr8Rpf8Szx-Q",
  authDomain: "dzwonek-app.firebaseapp.com",
  projectId: "dzwonek-app",
  storageBucket: "dzwonek-app.firebasestorage.app",
  messagingSenderId: "135918257462",
  appId: "1:135918257462:web:bc60ca0a1e92b453261f97",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'Dzwonek App';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
