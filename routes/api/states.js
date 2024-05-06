const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

// Route to get all states
router.get('/', statesController.getAllStates);
router.get('/', verifyStates, statesController.getAllStates);
router.get('/:state/funfact', verifyStates, statesController.getFunFact);


// Route to handle fun facts for a specific state
router.post('/:state/funfact', verifyStates, statesController.addFunFact);
router.patch('/:state/funfact', verifyStates, statesController.updateFunFact);
router.delete('/:state/funfact', verifyStates, statesController.deleteFunFact);

// Additional routes for state details
router.get('/:state', verifyStates, statesController.getState);
router.get('/:state/capital', verifyStates, statesController.getCapital);
router.get('/:state/nickname', verifyStates, statesController.getNickname);
router.get('/:state/population', verifyStates, statesController.getPopulation);
router.get('/:state/admission', verifyStates, statesController.getAdmission);

module.exports = router;

