const State = require('../model/State');
const statesData = require('../model/statesData.json');

const verifyStates = async (req, res, next) => {
    const stateCode = req.params.state ? req.params.state.toUpperCase() : undefined;
    console.log("Received state code:", stateCode);

    if (!stateCode) {
        console.log("No state code provided or invalid state code.");
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const dbState = await State.findOne({ stateCode: stateCode });
        if (dbState) {
            req.state = dbState;
            console.log("State found in DB:", dbState);
            return next();
        }

        
        const jsonState = statesData.find(state => state.code === stateCode);
        if (jsonState) {
            req.state = jsonState;
            console.log("State found in JSON data:", jsonState);
            return next();
        }

        console.log("State not found in DB or JSON data.");
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    } catch (error) {
        console.error("Error in verifyStates middleware:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyStates;
