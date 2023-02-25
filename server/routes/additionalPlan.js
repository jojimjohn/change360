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

// POST: Create additional 2-day meal plan
router.post('/', async (req, res) => {
  try {
   // const userId = req.params.userId;

    const {
      userId
    } = req.body;

    const user = await User.findById(userId);
    const nutrition = await Nutrition.findOne({ userId: userId });

    const message = `Create 2 additional days for this meal plan as well as a sample recipe for 1 of the meals based off of the previous data. Client = ${user.nickname} Gender: ${user.gender}, Age: ${user.age}, Height: ${user.height} cm, Weight: ${user.weight} kg, Fitness Level: ${user.fitnessLevel}, Fitness Goal: ${user.fitnessGoal}, Current Exercise: ${user.currentExercise}, Daily Activity: ${user.dailyActivity}, Enjoyable Exercise: ${nutrition.enjoyableExercise}, Current Diet: ${nutrition.currentDiet}, Diet Restriction: ${nutrition.dietRestriction}. Also include the associated Macros and calories for each meal provided and place all items in a table for ease of use. Lastly, Include create a grocery list for all the meals you provided in the plan and include the total number of items and associated weight or volume estimates.`;

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
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
