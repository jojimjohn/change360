const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  heightUnit: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  weightUnit: {
    type: String,
    required: true
  },
  fitnessLevel: {
    type: String,
    required: true
  },
  fitnessGoal: {
    type: String,
    required: true
  },
  curExercise: {
    type: String,
    required: true
  },
  dailyActivity: {
    type: String,
    required: true
  }
  // exerciseFrequency: {
  //   type: Number,
  //   required: true
  // },
  // exerciseTime: {
  //   type: Number,
  //   required: true
  // },
  // gymAccess: {
  //   type: Boolean,
  //   required: true
  // },
  // previousExperience: {
  //   type: String,
  //   required: true
  // }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
