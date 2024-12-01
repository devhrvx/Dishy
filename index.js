const data = [
    {
        title: "Generate recipes on the go.",
        description: "Try Dishy! <br> Type in your ingredients and see what dishes you can make from scratch!",
        bgImage: "url('res/preview_1.png')"
    },
    {
        title: "Feeling adventurous?",
        description: " Let us surprise your taste buds! Try something new and exciting in the kitchen today.",
        bgImage: "url('res/preview_2.png')"
    },
    {
        title: "Don’t know what to cook?",
        description: "Let us decide for you! Take the stress out of mealtime with our smart recipe generator.",
        bgImage: "url('res/preview_3.png')"
    }
];

let currentIndex = 0;
const previewDiv = document.querySelector('.preview');
const title = document.querySelector('.title');
const description = document.querySelector('.description');

function updatePreview() {
  var currentData = data[currentIndex];
  title.textContent = currentData.title;
  description.innerHTML = currentData.description;
  previewDiv.style.backgroundImage = currentData.bgImage;

  currentIndex = (currentIndex + 1) % data.length;
}

setInterval(updatePreview, 5000);
  