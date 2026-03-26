// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the config object
const firebaseConfig = {
  apiKey: "AIzaSyBbCYYmpb19bHgMDK94sQMcnySlBdrx5WQ",
  authDomain: "localservicehub-72d91.firebaseapp.com",
  projectId: "localservicehub-72d91",
  storageBucket: "localservicehub-72d91.firebasestorage.app",
  messagingSenderId: "1838064931",
  appId: "1:1838064931:web:73321286c50a2df07c9896",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png", // Replace with your logo if needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
