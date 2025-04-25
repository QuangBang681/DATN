import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyALP4jHix3R29s128Unu-e6M6azlpflfZQ",
    authDomain: "platformio-demo.firebaseapp.com",
    databaseURL: "https://platformio-demo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "platformio-demo",
    storageBucket: "platformio-demo.firebasestorage.app",
    messagingSenderId: "555395050458",
    appId: "1:555395050458:web:21ca99b763890c78346ee3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
