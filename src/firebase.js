import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDSJ3HetQ5_PGAxnLeWwQ8lG6S1FP2XdvU",
    authDomain: "cinema-elk-1cfa1.firebaseapp.com",
    projectId: "cinema-elk-1cfa1",
    storageBucket: "cinema-elk-1cfa1.firebasestorage.app",
    messagingSenderId: "713408207334",
    appId: "1:713408207334:web:35b898034aa1acfee4de27"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);