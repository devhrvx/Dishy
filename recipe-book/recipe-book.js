import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDvXage0SbYUMV8RFZzn48ANw4GX_D6Zfo",
  authDomain: "dishy-280a7.firebaseapp.com",
  projectId: "dishy-280a7",
  storageBucket: "dishy-280a7.firebasestorage.app",
  messagingSenderId: "785622443437",
  appId: "1:785622443437:web:acbe9c5813fb60be0c2d24",
  measurementId: "G-N3X5D4SQ58"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

var logoutButton = document.querySelector('.logoutButton');

let userId = null;

onAuthStateChanged(auth, (user) => {
	if (user) {
		userId = user.uid;
		console.log("User in recipe-book: " + user.displayName);
		console.log("User ID: " + userId);
		populateRecipes(userId);
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

async function populateRecipes(userId) {
	const recipesRef = collection(db, "recipes");
	const q = query(
	  recipesRef,
	  where("userId", "==", userId),   
	  orderBy("createdAt", "desc")
	);
  
	try {
	  const querySnapshot = await getDocs(q);
	  $(".container").empty();
  
	  querySnapshot.forEach((doc) => {
		const recipe = doc.data();
		let diffEmoji;

		if (recipe.difficulty == 'hard' ) {
			diffEmoji = '👨‍🍳👨‍🍳👨‍🍳';
		}
		else if (recipe.difficulty == 'medium'){
			diffEmoji = '👨‍🍳👨‍🍳';
		}
		else {
			diffEmoji = '👨‍🍳';
		}

		const recipeItem = `
		  <div class="item" data-recipe='${JSON.stringify(recipe)}'>
			<div class="dish-name">${recipe.dishName}</div>
			<div class="difficulty">Difficulty: ${diffEmoji}</div>
			<div class="flavor">${recipe.flavor}</div>
		  </div>`;

		$(".container").append(recipeItem);
	  });
	}
	
	catch (error) {
	  console.error("Error fetching recipes:", error);
	}
}


$(document).on("click", ".item", function() {
	const recipe = $(this).data("recipe");
	console.log(recipe);
	
	$("#popup-dishName").text(recipe.dishName);
	$("#popup-flavor").text(recipe.flavor);
	$("#popup-difficulty").text(recipe.difficulty);

	$("#popup-ingredients").empty();
		recipe.ingredients.forEach(ingredient => {
  		const listItem = `<li>${ingredient}</li>`;
  		$("#popup-ingredients").append(listItem);
	});

	$("#popup-procedures").empty();
		recipe.procedures.forEach(procedure => {
  		const listProcedure = `<li>${procedure}</li>`;
  		$("#popup-procedures").append(listProcedure);
	});
  
	$("#popup").fadeIn();
});
  
$(".close-btn").click(function() {
	$("#popup").fadeOut();
});

  