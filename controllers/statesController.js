const State = require('../model/State');
const statesData = require('../model/statesData.json');

const getStateFullName = (stateCode) => {
    const state = statesData.find(s => s.code === stateCode);
    return state ? state.state : "Unknown State";
};

const getFunFact = async (req, res) => {
    if (!req.state || !req.state.funfacts || req.state.funfacts.length === 0) {
        const stateCode = req.state ? req.state.stateCode : req.params.state.toUpperCase();
        const stateDisplayName = getStateFullName(stateCode);
        return res.status(404).json({ message: `No Fun Facts found for ${stateDisplayName}` });
    }
    const funFact = req.state.funfacts[Math.floor(Math.random() * req.state.funfacts.length)];
    res.json({ funfact: funFact });
};

const updateFunFact = async (req, res) => {
    const { state } = req.params;
    const { index, funfact } = req.body;

    if (index === undefined) {
        return res.status(400).json({ error: 'State fun facts value required' });
    }

    if (funfact === undefined || typeof funfact !== 'string') {
        return res.status(400).json({ error: 'State fun facts value required' });
    }

    const stateCode = state.toUpperCase();
    const dbState = await State.findOne({ stateCode });

    const stateDisplayName = getStateFullName(stateCode);

    if (!dbState) {
        return res.status(404).json({ error: `State not found for ${stateDisplayName}` });
    }

    if (!dbState.funfacts || dbState.funfacts.length === 0) {
        return res.status(404).json({ error: `No Fun Facts found for ${stateDisplayName}` });
    }

    const adjustedIndex = parseInt(index, 10) - 1;
    if (isNaN(adjustedIndex) || adjustedIndex < 0 || adjustedIndex >= dbState.funfacts.length) {
        return res.status(404).json({ error: `No Fun Fact found at that index for ${stateDisplayName}` });
    }

    dbState.funfacts[adjustedIndex] = funfact;
    await dbState.save();

    res.json({
        message: 'Fun fact updated successfully',
        state: stateDisplayName, 
        funfacts: dbState.funfacts,
        totalFunFacts: dbState.funfacts.length
    });
};


const deleteFunFact = async (req, res) => {
    const { state } = req.params;
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ error: 'State fun fact index value required' });
    }

    const adjustedIndex = parseInt(index, 10) - 1;
    if (isNaN(adjustedIndex) || adjustedIndex < 0) {
        return res.status(400).json({ error: 'State fun fact index value required' });
    }

    try {
        const stateCode = state.toUpperCase();
        const dbState = await State.findOne({ stateCode: stateCode });
        const stateDisplayName = getStateFullName(stateCode); 

        if (!dbState || !dbState.funfacts) {
            return res.status(404).json({ error: `No Fun Facts found for ${stateDisplayName}` });
        }

        if (adjustedIndex >= dbState.funfacts.length) {
            return res.status(404).json({ error: `No Fun Fact found at that index for ${stateDisplayName}` });
        }

        dbState.funfacts.splice(adjustedIndex, 1);
        await dbState.save();

        res.json({
            message: 'Fun fact deleted successfully',
            state: stateDisplayName, 
            funfacts: dbState.funfacts,
            totalFunFacts: dbState.funfacts.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const addFunFact = async (req, res) => {
    try {
        const { state } = req.params;

        if (!req.body.hasOwnProperty('funfacts')) {
            return res.status(400).json({ error: 'State fun facts value required' });
        }

        const { funfacts } = req.body;

        if (!Array.isArray(funfacts)) {
            return res.status(400).json({ error: 'State fun facts value must be an array' });
        }

        let dbState = await State.findOne({ stateCode: state.toUpperCase() });
        if (!dbState) {
            return res.status(404).json({ error: `State not found for code ${state.toUpperCase()}, cannot add fun facts.` });
        }

        dbState.funfacts = dbState.funfacts.concat(funfacts);
        await dbState.save();

        res.status(201).json({
            message: 'Fun facts added successfully',
            state: dbState.stateCode,
            funfacts: dbState.funfacts,
            totalFunFacts: dbState.funfacts.length
        });
    } catch (error) {
        console.error('Error adding fun facts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllStates = async (req, res) => {
    try {
        let query = {};
        if (req.query.contig) {
            const isContig = req.query.contig === 'true';
            query.stateCode = isContig ? { $nin: ['AK', 'HI'] } : { $in: ['AK', 'HI'] };
        }
        const dbStates = await State.find(query);
        res.json(dbStates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getState = async (req, res) => {
    if (!req.state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
    
    const fullStateName = getStateFullName(req.state.stateCode);

    let response = {
        state: fullStateName,
        capital: req.state.capital,
        nickname: req.state.nickname,
        population: req.state.population,
        admitted: req.state.admission.toISOString().split('T')[0] // Formatting the date
    };

    if (req.state.funfacts && req.state.funfacts.length > 0) {
        response.funfacts = req.state.funfacts;
    }

    res.json(response);
};

const getCapital = async (req, res) => {
    if (!req.state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
    const fullStateName = getStateFullName(req.state.stateCode);  
    res.json({ state: fullStateName, capital: req.state.capital });
};

const getNickname = async (req, res) => {
    if (!req.state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
    const fullStateName = getStateFullName(req.state.stateCode);
    res.json({ state: fullStateName, nickname: req.state.nickname });
};

const getPopulation = async (req, res) => {
    if (!req.state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
    const fullStateName = getStateFullName(req.state.stateCode);
    const formattedPopulation = req.state.population.toLocaleString();
    res.json({ state: fullStateName, population: formattedPopulation });
};

const getAdmission = async (req, res) => {
    if (!req.state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
    
    const fullStateName = getStateFullName(req.state.stateCode);

    
    const admittedDate = req.state.admission.toISOString().split('T')[0];
    res.json({ state: fullStateName, admitted: admittedDate });
};


module.exports = { 
    getStateFullName,
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
