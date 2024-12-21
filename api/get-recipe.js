import express from "express";
import { OpenAI } from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});


app.post("/api/get-recipe", async (request, result) => {
    const { dishType, flavor, difficulty, count } = request.body;

    try {

        const prompt = `
            Generate ${dishType || "any"} ${count || "3"} recipes in strict JSON format:
            [
              {
                "dishName": "Dish Name",
                "flavor": "${flavor || "any"}",
                "difficulty": "${difficulty || "easy"}",
                "ingredients": ["Ingredient1", "Ingredient2"],
                "procedures": ["Step1", "Step2"]
              }
            ]
            Ensure that the JSON is correctly formatted with no additional explanation or text.
            Only return the JSON array with the recipe data.
            `;

                
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful recipe generator." },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });
              
            

        const recipeText = response.choices[0].message.content.trim();
        const recipes = parseRecipes(recipeText);

        result.status(200).json({ success: true, recipes });
        console.log(response.choices[0].message.content.trim());
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
    const dishName = lines.find((line) => line.startsWith("Dish Name: "))?.replace("Dish Name: ", "").trim() || "Unknown Dish";
    const flavor = lines.find((line) => line.startsWith("Flavor: "))?.replace("Flavor: ", "").trim() || "Unknown Flavor";
    const difficulty = lines.find((line) => line.startsWith("Difficulty: "))?.replace("Difficulty: ", "").trim() || "Unknown Difficulty";
  
    const ingredientsStart = lines.indexOf("Ingredients:") + 1;
    const proceduresStart = lines.indexOf("Procedures:") + 1;
  
    const ingredients = lines.slice(ingredientsStart, proceduresStart - 1).filter((line) => line);
    const procedures = lines.slice(proceduresStart).filter((line) => line);
  
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
