const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentDiet: {
    type: String,
    required: true
  },
  dietRestrictions: {
    type: String,
    required: true
  },
  mealsPerDay: {
    type: String,
    required: true
  },
  favFoods: {
    type: String,
    required: false
  },
  foodToAvoid: {
    type: String,
    required: false
  },
  moreDietRestrictions: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = Nutrition;