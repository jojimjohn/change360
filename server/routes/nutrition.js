const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Nutrition = require('../models/nutrition');
const axios = require('axios');

require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// POST: Store nutrition data for a user and get 1 day meal plan
router.post('/', async (req, res) => {
  try {

    const {
        userId,
        currentDiet,
        dietRestrictions,
        mealsPerDay,
        favFoods,
        foodToAvoid,
        moreDietRestrictions
      } = req.body;
      

    // Check that the required fields are present in the request body
    const requiredFields = ['currentDiet', 'dietRestrictions', 'mealsPerDay'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing ${field} field` });
      }
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const nutritionData = new Nutrition({
      userId: user._id,
      currentDiet,
      dietRestrictions,
      mealsPerDay,
      favFoods,
      foodToAvoid,
      moreDietRestrictions
    });

    await nutritionData.save();

    const message = `Name: ${user.nickname}, Current Diet: ${currentDiet}, Diet Restriction: ${dietRestrictions}, Meals and snacks: ${mealsPerDay} per day, Favorite foods: ${favFoods}, Foods to avoid: ${foodToAvoid}, More food restrictions or allergies: ${moreDietRestrictions}. I want you to create a detailed 5 day meal plan in table format, however only display 1 full day, for this prompt as well as a sample recipe for 1 of the meals for this full day. Also incldue the associated Macros and calories for each meal provided and place all items in a table for ease of use. At the end of the meal plan, there is a grocery list that  summarizes the total quantity / volume  of each item used for this full day of the 5 day  plan. The grocery list contains enough quantities/volume to make all the meals for the entire day. Also include the applicable weight, size, of the items on the list. Such as Chicken breast .5kg / 1lb, or beans  can / 16oz, 1 jar /14oz. The meal plan contains only ingredients that can be found at most supermarkets in the United States. Also include a hypothetical cost for this plan based off historical data and USA average grocery prices for these items. Lastly include 3 restaurant menu items from popular USA restaurant chains that could supplement one meal and include the associated calories and macros. Prepare the one day full plan now.`;

    const response = await openai.createCompletion({
      model: `text-davinci-003`, 
      prompt: `${message}`,
      temperature: 0.5,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.json({
      message: response.data.choices[0].text,
      userId: user.id,
      name: user.nickname
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
