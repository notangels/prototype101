require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./model/State');
const statesData = require('./model/statesData.json');

// Define fun facts for each state
const funFacts = {
  "CO": [
    "Colorado is known as the Centennial State.",
    "Denver, Colorado, lays claim to the invention of the cheeseburger.",
    "Colorado has the highest paved road in North America, reaching an elevation of 14,130 feet."
  ],
  "KS": [
    "Kansas is known as the Sunflower State.",
    "Kansas is home to 26 state parks.",
    "Kansas is made up of 88% farmland."
  ],
  "MO": [
    "Missouri is known as the Show Me State.",
    "The Gateway Arch in St. Louis is the tallest man-made monument in the United States.",
    "The ice cream cone was invented at the 1904 World's Fair in St. Louis, Missouri."
  ],
  "OK": [
    "Oklahoma is known as the Sooner State.",
    "The National Cowboy Hall of Fame is located in Oklahoma City.",
    "Oklahoma City is home to the largest Asian population in the United States per capita."
  ],
  "NE": [
    "Nebraska is known as the Cornhusker State.",
    "Kool-Aid was invented in Hastings, Nebraska.",
    "Nebraska has more miles of river than any other state."
  ]
};

async function populateDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log('Connected to MongoDB');

        // Insert data into the database
        for (const stateData of statesData) {
            const stateCode = stateData.code;

            console.log(`Processing state with code: ${stateCode}`);

            const state = new State({
                stateCode: stateCode,
                funfacts: funFacts[stateCode] || [], // Use predefined fun facts or empty array if not available
                capital: stateData.capital_city,
                nickname: stateData.nickname,
                population: stateData.population,
                admission: stateData.admission_date
            });

            console.log('Saving state to database:', state);

            await state.save();

            console.log(`State ${stateCode} saved successfully`);
        }

        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Execute the script
populateDatabase();
