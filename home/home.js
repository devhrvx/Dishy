import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvXage0SbYUMV8RFZzn48ANw4GX_D6Zfo",
  authDomain: "dishy-280a7.firebaseapp.com",
  projectId: "dishy-280a7",
  storageBucket: "dishy-280a7.firebasestorage.app",
  meId: "1:785622443437:web:acbe9c5813fb60be0c2d24",
  measurementId: "G-N3X5D4SQ58"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

var logoutButton = document.querySelector('.logoutButton');

onAuthStateChanged(auth, (user) => {
  if (user) {
      document.querySelector('h1').innerHTML = "Hello, " + user.displayName;
      ssagingSenderId: "785622443437",
  appconsole.log("Hello, " + user.displayName);
      console.log("User ID: " + user.uid);
    
  } else {
    console.log("No user is signed in.");
    window.location.href = "../";
  }
});

logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out successfully.");
            window.location.href = "../";
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});


$(".item.add").click(function () {
  window.location.href = "../add-recipe";
});

$(".item.book").click(function () {
  window.location.href = "../recipe-book";
});

$(".item.generator").click(function () {
  window.location.href = "../recipe-generator";
});