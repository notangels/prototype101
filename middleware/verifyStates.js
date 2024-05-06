const State = require('../model/State');
const statesData = require('../model/statesData.json');

const verifyStates = async (req, res, next) => {
    // Safely handle potentially undefined 'state' parameter and convert to uppercase if it exists
    const stateCode = req.params.state ? req.params.state.toUpperCase() : undefined;

    console.log("Received state code:", stateCode);

    // Check if stateCode is undefined or empty after the safety check
    if (!stateCode) {
        console.log("No state code provided or invalid state code.");
        return res.status(400).json({ message: 'State code parameter is required' });
    }

    try {
        // Attempt to find the state in the database first
        const dbState = await State.findOne({ stateCode: stateCode });
        if (dbState) {
            req.state = dbState;
            console.log("State found in DB:", dbState);
            return next();  // Continue to next middleware or route handler
        }

        // If not found in the database, check the static JSON data
        const jsonState = statesData.find(state => state.code === stateCode);
        if (jsonState) {
            req.state = jsonState;
            console.log("State found in JSON data:", jsonState);
            return next();  // Continue to next middleware or route handler
        }

        // If not found in both DB and JSON data
        console.log("State not found in DB or JSON data.");
        return res.status(404).json({ message: 'State not found' });
    } catch (error) {
        console.error("Error in verifyStates middleware:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyStates;



//old
/*const State = require('../model/State');
const statesData = require('../model/statesData.json');

const verifyStates = async (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    console.log("Received state code:", stateCode);

    if (!stateCode) {
        return res.status(400).json({ message: 'State code parameter is required' });
    }

    try {
        const dbState = await State.findOne({ stateCode: stateCode });
        if (dbState) {
            req.state = dbState;
            console.log("State found in DB:", dbState);
            return next();
        }

        const jsonState = statesData.find(state => state.code === stateCode);
        if (!jsonState) {
            console.log("State not found in JSON data.");
            return res.status(404).json({ message: 'State not found' });
        }

        req.state = jsonState;
        console.log("State found in JSON data:", jsonState);
        next();
    } catch (error) {
        console.error("Error in verifyStates middleware:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyStates;
*/