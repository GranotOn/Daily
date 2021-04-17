import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCkG4yp4OmbULiAoEcNN5G2OG8dkkzj38I",
  authDomain: "task-timer-b283a.firebaseapp.com",
  projectId: "task-timer-b283a",
  storageBucket: "task-timer-b283a.appspot.com",
  messagingSenderId: "403441764975",
  appId: "1:403441764975:web:f09ba420ce9f0693ab1b9a",
};
let app = firebase.initializeApp(firebaseConfig);
export default app;

export const db = firebase.firestore(app);
