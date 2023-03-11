const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/user');

// Route for getting AI feedback
router.post('/', async (req, res) => {
  const { answers, address } = req.body;

  try {
   const user = await User.findOne({ address: address });
   const { nickname, gender, age, height, heightUnit, weight, weightUnit, fitnessLevel, fitnessGoal, curExercise, dailyActivity } = user;
    
    const prompt = `Imagine you are a world class health and fitness coach  known as “C.H.A.N.G.E.360” and you are tasked with creating a nutrition program for a client ${nickname} who has been using your services for a few days to get them the best results in the fastest most sustainable way possible. The solution must be a new 1 day meal plan based on updated data, the plan must adhere to  ${nickname}'s follow-up information and provide at least 1 recipe from the meal plan. Client summary =Gender: ${gender}, Age: ${age}, Height: ${height} ${heightUnit}, Weight: ${weight} ${weightUnit}, Fitness Level: ${fitnessLevel}, Fitness Goal: ${fitnessGoal}, Current Exercise: ${curExercise}, Daily Activity: ${dailyActivity}.,  Client follow-up information: ${answers}.Prepare the one day full plan now.`;   
  
    // I want you to create a detailed 5 day meal plan in table format, however only display 1 full day, for this prompt as well as a sample recipe for 1 of the meals 
    // for this full day. Also incldue the associated Macros and calories for each meal provided and place all items in a table for ease of use. At the end of the meal plan, 
    // there is a grocery list that  summarizes the total quantity / volume  of each item used for this full day of the 5 day  plan. 
    // The grocery list contains enough quantities/volume to make all the meals for the entire day. 
    // Also include the applicable weight, size, of the items on the list. Such as Chicken breast .5kg / 1lb, or beans  can / 16oz, 1 jar /14oz. 
    // The meal plan contains only ingredients that can be found at most supermarkets in the United States. 
    // Also include a hypothetical cost for this plan based off historical data and USA average grocery prices for these items. 
    // Lastly include 3 restaurant menu items from popular USA restaurant chains that could supplement one meal and include the associated calories and macros. 
    // Prepare the one day full plan now.
   
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: `${prompt}`,
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    res.json({
        message: response.data.choices[0].text
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
