const State = require('../model/State');
const statesData = require('../model/statesData.json');


const getFunFact = async (req, res) => {
    if (!req.state || !req.state.funfacts || req.state.funfacts.length === 0) {
        return res.status(404).json({ message: 'No fun facts found for this state' });
    }
    const funFact = req.state.funfacts[Math.floor(Math.random() * req.state.funfacts.length)];
    res.json({ state: req.state.stateCode, funFact: funFact });
};

// Function to add a fun fact to a state
const addFunFact = async (req, res) => {
    try {
        const { state } = req.params;
        const { funfacts } = req.body;

        // Find the state in the database
        let dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            // If state not found, create a new state entry
            dbState = new State({ stateCode: state, funfacts });
        } else {
            // If state found, add the provided fun facts to the state
            dbState.funfacts.push(...funfacts);
        }

        // Save the state to the database
        await dbState.save();

        res.status(201).json({ message: 'Fun facts added successfully', state: dbState.stateCode, funfacts: dbState.funfacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a fun fact for a state
const updateFunFact = async (req, res) => {
    try {
        const { state } = req.params;
        const { index, funfact } = req.body;

        // Find the state in the database
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        // Update the fun fact at the specified index
        if (index < 1 || index > dbState.funfacts.length) {
            return res.status(400).json({ error: 'Invalid index parameter' });
        }

        dbState.funfacts[index - 1] = funfact;
        await dbState.save();

        res.json({ message: 'Fun fact updated successfully', state: dbState.stateCode, funfacts: dbState.funfacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a fun fact from a state
const deleteFunFact = async (req, res) => {
    try {
        const { state } = req.params;
        const { index } = req.body;

        // Find the state in the database
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        // Remove the fun fact at the specified index
        if (index < 1 || index > dbState.funfacts.length) {
            return res.status(400).json({ error: 'Invalid index parameter' });
        }

        dbState.funfacts.splice(index - 1, 1);
        await dbState.save();

        res.json({ message: 'Fun fact deleted successfully', state: dbState.stateCode, funfacts: dbState.funfacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/* Function to get all states
const getAllStates = async (req, res) => {
    try {
        const dbStates = await State.find();

        res.json(dbStates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};*/
const getAllStates = async (req, res) => {
    try {
        let query = {}; // Start with an empty query object which means no filters applied

        // Check if the 'contig' query parameter is provided
        if (req.query.contig) {
            const isContig = req.query.contig === 'true';
            // Apply filters based on whether 'contig' is true or false
            if (isContig) {
                query.stateCode = { $nin: ['AK', 'HI'] };  // Exclude Alaska and Hawaii for contiguous states
            } else {
                query.stateCode = { $in: ['AK', 'HI'] };   // Include only Alaska and Hawaii for non-contiguous states
            }
        }

        // Perform the query with or without filters based on the presence of 'contig' parameter
        const dbStates = await State.find(query);
        res.json(dbStates); // Return the result as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle any errors
    }
};


// Function to get state details
const getState = async (req, res) => {
    try {
        const { state } = req.params;
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        res.json(dbState);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get capital of a state
const getCapital = async (req, res) => {
    try {
        const { state } = req.params;
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        res.json({ state: dbState.stateCode, capital: dbState.capital });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get nickname of a state
const getNickname = async (req, res) => {
    try {
        const { state } = req.params;
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        res.json({ state: dbState.stateCode, nickname: dbState.nickname });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get population of a state
const getPopulation = async (req, res) => {
    try {
        const { state } = req.params;
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        res.json({ state: dbState.stateCode, population: dbState.population });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get admission date of a state
const getAdmission = async (req, res) => {
    try {
        const { state } = req.params;
        const dbState = await State.findOne({ stateCode: state });

        if (!dbState) {
            return res.status(404).json({ error: 'State not found' });
        }

        res.json({ state: dbState.stateCode, admitted: dbState.admission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Export all controller functions
module.exports = { 
    getFunFact,
    addFunFact, 
    updateFunFact, 
    deleteFunFact, 
    getAllStates, 
    getState, 
    getCapital, 
    getNickname, 
    getPopulation, 
    getAdmission 
};
