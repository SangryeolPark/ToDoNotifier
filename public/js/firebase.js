let firebaseAuth, firebaseDatabase;
const firebaseConfig = {
    apiKey: "AIzaSyCcrEByCpYeZuoq1Gy-yRJYyISoIa-DPkk",
    authDomain: "todo-notifier-20810.firebaseapp.com",
    databaseURL: "https://todo-notifier-20810-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todo-notifier-20810",
    storageBucket: "todo-notifier-20810.appspot.com",
    messagingSenderId: "79380960791",
    appId: "1:79380960791:web:812adec82069d331dc6e52",
    measurementId: "G-GXQGXLSLHV"
};

firebase.initializeApp(firebaseConfig);
firebaseAuth = firebase.auth();
firebaseDatabase = firebase.database();