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
    console.log("Hello, " + user.displayName);
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

$(document).ready(async () => {
  try {
    const response = await fetch("../api/get-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dishType: "any",
        flavor: "any",
        difficulty: "any",
        count: 3
      })
    });

    const data = await response.json();
    if (data.success) {
      displayRecipes(data.recipes);
    } else {
      console.error("Failed to fetch recipes");
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
});

function showRecipePopup(recipe) {
  const $popup = $("#popup");
  $popup.find("#popup-dishName").text(recipe.dishName);
  $popup.find("#popup-flavor").text(recipe.flavor);
  $popup.find("#popup-difficulty").text(recipe.difficulty);
  $popup.find("#popup-ingredients").html(recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join(""));
  $popup.find("#popup-procedures").html(recipe.procedures.map(procedure => `<li>${procedure}</li>`).join(""));

  $popup.show();
}

$(".close-btn").click(() => {
  $("#popup").hide();
});

function displayRecipes(recipes) {
  const $recipeGrid = $(".recipe-grid");
  $recipeGrid.empty();

  recipes.forEach((recipe) => {
    const $recipeItem = $(`
      <div class="recipe-item" data-recipe='${JSON.stringify(recipe)}'>
        <div class="dish-name">${recipe.dishName}</div>
        <div class="difficulty">Difficulty: ${recipe.difficulty}</div>
        <div class="flavor">${recipe.flavor}</div>
      </div>
    `);

    $recipeItem.click(() => {
      showRecipePopup(recipe);
    });

    $recipeGrid.append($recipeItem);
  });
}
