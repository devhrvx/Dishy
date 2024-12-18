import express from "express";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
    })
);

app.post("/api/get-recipe", async (request, result) => {
    const { dishType, flavor, difficulty, count } = request.body;

    try {
        const prompt = `
            Generate ${count || "3"} recipes for a ${dishType || "dish"} with a ${flavor || "balanced"} flavor, and ${difficulty || "easy"} difficulty.
            Include:
            - Dish Name
            - Flavor Description
            - Difficulty Level (easy, medium, hard)
            - List of Ingredients (as an array)
            - Step-by-Step Procedures (as an array)
        `;

        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt,
            max_tokens: 500,
            temperature: 0.7,
        });

        const recipeText = response.data.choices[0].text.trim();
        const recipes = parseRecipes(recipeText);

        result.status(200).json({ success: true, recipes });
    }
    
    catch (error) {
        console.error("Error generating recipe:", error);
        result.status(500).json({ success: false, message: "Failed to generate recipe" });
    }
});

function parseRecipes(recipesText) {
    const recipeBlocks = recipesText.split("\n\n").filter((block) => block.trim() !== "");
    return recipeBlocks.map((block) => parseRecipe(block));
}
  
function parseRecipe(recipeText) {
    const lines = recipeText.split("\n").filter((line) => line.trim() !== "");
    const dishName = lines[0].replace("Dish Name: ", "").trim();
    const flavor = lines[1].replace("Flavor: ", "").trim();
    const difficulty = lines[2].replace("Difficulty: ", "").trim();
  
    const ingredientsStart = lines.indexOf("Ingredients:") + 1;
    const proceduresStart = lines.indexOf("Procedures:") + 1;
  
    const ingredients = [];
    const procedures = [];
  
    for (let i = ingredientsStart; i < proceduresStart - 1; i++) {
      ingredients.push(lines[i].trim());
    }
  
    for (let i = proceduresStart; i < lines.length; i++) {
      procedures.push(lines[i].trim());
    }
  
    return {
      dishName,
      flavor,
      difficulty,
      ingredients,
      procedures,
    };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
