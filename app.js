const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions ={
  origin:'*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials:true,           
  optionSuccessStatus:200,
}



require('dotenv').config();

const usersRouter = require('./routes/users');
const nutritionRouter = require('./routes/nutrition');
const additionalPlanRoute = require('./routes/additionalPlan');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
app.use(cors(corsOptions))

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/additionalplan', additionalPlanRoute);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`Error: ${err}`));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
