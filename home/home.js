import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

let userId;

const logoutButton = document.querySelector('.logoutButton');

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector('h1').innerHTML = "Hello, " + user.displayName;
    console.log("Hello, " + user.displayName);
    console.log("User ID: " + user.uid);
    userId = user.uid;
  } else {
    console.log("No user is signed in.");
    window.location.href = "../";
  }
});

logoutButton.addEventListener('click', function() {
  signOut(auth)
    .then(function() {
      console.log("User logged out successfully.");
      window.location.href = "../";
    })
    .catch(function(error) {
      console.error("Error logging out:", error);
    });
});

$(".item.add").click(function() {
  window.location.href = "../add-recipe";
});

$(".item.book").click(function() {
  window.location.href = "../recipe-book";
});

$(".item.generator").click(function() {
  window.location.href = "../recipe-generator";
});

$(document).ready(async function() {
  try {
    const response = await fetch("/api/get-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        containsIngredients: "any",
        flavor: "any",
        difficulty: "any",
        count: 3
      })
    });

    const data = await response.json();
    if (data.success) {
      displayRecipes(data.recipes);
      $(".recipe-grid").css("display", "grid");
    } else {
      console.error("Failed to fetch recipes");
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
});

let diffEmoji;

function showRecipePopup(recipe) {
  const $popup = $("#popup");
  $popup.find("#popup-dishName").text(recipe.dishName);
  $popup.find("#popup-flavor").text(recipe.flavor);
  if (recipe.difficulty === 'hard') {
    diffEmoji = '👨‍🍳👨‍🍳👨‍🍳';
  } else if (recipe.difficulty === 'medium') {
    diffEmoji = '👨‍🍳👨‍🍳';
  } else {
    diffEmoji = '👨‍🍳';
  }
  $popup.find("#popup-difficulty").text(diffEmoji);
  $popup.find("#popup-ingredients").html(recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join(""));
  $popup.find("#popup-procedures").html(recipe.procedures.map(procedure => `<li>${procedure}</li>`).join(""));

  $popup.show();
}

$(".save").click(async function() {
  const dishName = $("#popup-dishName").text();
  const flavor = $("#popup-flavor").text();
  var difficulty;
  if ($("#popup-difficulty").text() == '👨‍🍳👨‍🍳👨‍🍳') {
    difficulty = 'hard';
  } else if (recipe.difficulty === '👨‍🍳👨‍🍳') {
    difficulty = 'medium';
  } else {
    difficulty = 'easy';
  }
  const ingredients = $("#popup-ingredients li").map(function() {
    return $(this).text();
  }).get();
  const procedures = $("#popup-procedures li").map(function() {
    return $(this).text();
  }).get();

  if (dishName && flavor && ingredients.length > 0 && procedures.length > 0) {
    try {
      await addDoc(collection(db, "recipes"), {
        userId: userId,
        dishName: dishName,
        flavor: flavor,
        ingredients: ingredients,
        procedures: procedures,
        difficulty: difficulty,
        createdAt: new Date(),
      });
      $("#popup").fadeOut();
      $(".saved").fadeIn();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error saving recipe");
    }
  } else {
    alert("An error occurred.");
  }
});

$("#closePopup").click(function() {
  $(".saved").fadeOut();
});

$(".close-btn").click(function() {
  $("#popup").hide();
});

$("#show").click(function() {
  showRecipePopup(sample);
});

function displayRecipes(recipes) {
  const $recipeGrid = $(".recipe-grid");
  $recipeGrid.empty(); // Clear for the loader

  recipes.forEach(function(recipe) {
    if (recipe.difficulty === 'hard') {
      diffEmoji = '👨‍🍳👨‍🍳👨‍🍳';
    } else if (recipe.difficulty === 'medium') {
      diffEmoji = '👨‍🍳👨‍🍳';
    } else {
      diffEmoji = '👨‍🍳';
    }
    const $recipeItem = $(`
      <div class="recipe-item" data-recipe='${JSON.stringify(recipe)}'>
        <div class="dish-name">${recipe.dishName}</div>
        <div class="difficulty">Difficulty: ${diffEmoji}</div>
        <div class="flavor">${recipe.flavor}</div>
      </div>
    `);

    $recipeItem.click(function() {
      showRecipePopup(recipe);
    });

    $recipeGrid.append($recipeItem);
  });
}