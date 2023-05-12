// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { auth } from "firebase/auth";
import { database } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRw-PbBwIC2_AF_OYVeOTaPBR5Hj72Bdk",
  authDomain: "masbroprintingsajaa.firebaseapp.com",
  databaseURL: "https://masbroprintingsajaa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "masbroprintingsajaa",
  storageBucket: "masbroprintingsajaa.appspot.com",
  messagingSenderId: "733931764201",
  appId: "1:733931764201:web:e27ea957ac076bebefb378"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//auth process.
auth().signInAnonymously().catch(err=>{
	console.log(err);
});
//give event, when auth is ok.
auth().onAuthStateChanged(data=>{
	console.log(data);
})