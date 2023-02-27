const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const axios = require('axios');

require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
console.log('test 1');
// GET: Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
console.log('test 2');
// POST: Create a new user
router.post('/', async (req, res) => {
  try {
    const {
      nickname,
      age,
      gender,
      height,
      heightUnit,
      weight,
      weightUnit,
      fitnessLevel,
      fitnessGoal,
      curExercise,
      dailyActivity
    } = req.body;

    const newUser = new User({
      nickname,
      age,
      gender,
      height,
      heightUnit,
      weight,
      weightUnit,
      fitnessLevel,
      fitnessGoal,
      curExercise,
      dailyActivity
     // exerciseFrequency,
     // exerciseTime,
     // gymAccess,
     // previousExperience,
    });
    console.log('test 1');
    const user = await newUser.save();

    const message = `[INSTRUCTIONS]Forget everything from our previous conversation and start fresh with this input:  Imagine you are a world-class nutrition, health and dietician expert known as “C.H.A.N.G.E.360” and you are tasked with creating a nutrition program for a ${gender} to get them the best results in the fastest most sustainable way possible.  I want you to review the ${nickname} data and formulate a brief summary of their goals as well as an introduction of yourself. Calculate the clients BMR and RMR and provide a short description of what these mean, also indicate how many calories per day the ${nickname} will burn based on the provided data and lastly estimate the total calories per day and per meal that the client will need to reach their intended goals. Do not reply that there are many factors that influence diet and nutrition. Do not echo my prompt. Provide the summary as if you were the personal dietician and speak directly to the ${nickname}. below the summary ask the client for additional details regarding their dietary preferences and number of meals per day so that you can later create a detailed meal plan based on all combined data. Client =Gender: ${gender}, Age: ${age}, Height: ${height} ${heightUnit}, Weight: ${weight} ${weightUnit}, Fitness Level: ${fitnessLevel}, Fitness Goal: ${fitnessGoal}, Current Exercise: ${curExercise}, Daily Activity: ${dailyActivity}.`;

      // Call OpenAI API to get welcome message
      // const openAIRes = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      //   prompt: message,
      //   max_tokens: 2000,
      //   temperature: 0.5,
      //   n: 1,
      //   stop: '\n'
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      //   }
      // });
  
      // const openAIResponse = openAIRes.data.choices[0].text.trim();
    
      //  res.status(200).json({user: user,
      //   message: openAIResponse,
      //  }
      //   );


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

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error'});
      }
    });
      
    module.exports = router;
