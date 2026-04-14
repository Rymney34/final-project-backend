import dotenv from 'dotenv';
dotenv.config();
// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoute = require("../routes/userRoute.js").default;
const museumRoute = require("../routes/museumRoute.js").default;
const aiRoute = require("../routes/aiRoute.js").default;
const db = require('../config/dbConnect.js'); 

const app = express();

app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Routes
app.use('/api', userRoute);
app.use('/api', museumRoute);
app.use((req, res, next) => {
  req.userSummary = "The user is obsessed with dinosaurs and Jurasic fossils."
  next()
})
app.use('/api', aiRoute);

// Test route
app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend" });
});

// Only start server if NOT testing
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  db._connect(); 
  app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

module.exports = app;
