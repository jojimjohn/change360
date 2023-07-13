const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/user');

require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Route for getting AI feedback
router.post('/', async (req, res) => {
  const { answers, address } = req.body;

  try {
   const user = await User.findOne({ address: address });
   if (!user) {
    // Handle the case when the user is not found, for example:
    console.error('User not found');

  } else {
    const { nickname, gender, age, height, heightUnit, weight, weightUnit, fitnessLevel, fitnessGoal, curExercise, dailyActivity } = user;
    
    const prompt = `Imagine you are a world class health and fitness coach  known as “C.H.A.N.G.E.360” and you are tasked with creating a nutrition program for a client ${nickname} who has been using your services for a few days to get them the best results in the fastest most sustainable way possible. \n\nThe solution must be a new detailed meal plan, sample recipe, recommendations and tips based on client responses. Start by answering to the client responses with a list of useful tips the client can follow.\n\n The plan must adhere to  ${nickname}'s follow-up information. Also include the associated Macros and calories for each meal provided and place all items in a table format for ease of use. Provide one sample recipe from the meal plan to the client. At the end of the meal plan, there is a grocery list that summarizes the total quantity / volume  of each item used for this plan. Do not reply that there are many factors that influence diet and nutrition. Do not echo my prompt but reiterate client responses for emphasis. Speak directly to the client.\n\n Client summary =Gender: ${gender}, Age: ${age}, Height: ${height} ${heightUnit}, Weight: ${weight} ${weightUnit}, Fitness Level: ${fitnessLevel}, Fitness Goal: ${fitnessGoal}, Current Exercise: ${curExercise}, Daily Activity: ${dailyActivity}., ${answers}. \n\nPrepare the one day full plan now and provide recommendations based on client feedback.`;   
    
    console.log(address);
    // const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    //     prompt: `${prompt}`,
    //     temperature: 0.5,
    //     max_tokens: 4000,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0,
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    // });

    const response = await openai.createCompletion({
      model: `gpt-3.5-turbo`, 
      prompt: `${prompt}`,
      temperature: 0.3,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    res.json({
        message: response.data.choices[0].text
      });
  }
   

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route for getting initial AI response
router.post('/init', async (req, res) => {
  try {

    const {
        userId,
      } = req.body;
  
      const user = await User.findOne({ address: userId });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      } else {

      const { nickname, gender, age, height, heightUnit, weight, weightUnit, fitnessLevel, fitnessGoal, curExercise, dailyActivity } = user;

      const message = `[INSTRUCTIONS]Forget everything from our previous conversation and start fresh with this input:  Imagine you are a world-class nutrition, health and dietician expert known as “C.H.A.N.G.E.360” and you are tasked with creating a nutrition program for a ${gender} to get them the best results in the fastest most sustainable way possible.  I want you to review the ${nickname} data and formulate a brief summary of their goals as well as an introduction of yourself. Calculate the clients BMR and RMR and provide a short description of what these mean, also indicate how many calories per day the ${nickname} will burn based on the provided data and lastly estimate the total calories per day and per meal that the client will need to reach their intended goals. Do not reply that there are many factors that influence diet and nutrition. Do not echo my prompt. Provide the summary as if you were the personal dietician and speak directly to the ${nickname}. below the summary ask the client for additional details regarding their dietary preferences and number of meals per day so that you can later create a detailed meal plan based on all combined data. Client =Gender: ${gender}, Age: ${age}, Height: ${height} ${heightUnit}, Weight: ${weight} ${weightUnit}, Fitness Level: ${fitnessLevel}, Fitness Goal: ${fitnessGoal}, Current Exercise: ${curExercise}, Daily Activity: ${dailyActivity}.`;
  
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
      });
    }

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
