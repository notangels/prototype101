const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');


router.get('/', statesController.getAllStates);

router.get('/:state/funfact', verifyStates, statesController.getFunFact);
router.post('/:state/funfact', verifyStates, statesController.addFunFact);
router.patch('/:state/funfact', verifyStates, statesController.updateFunFact);
router.delete('/:state/funfact', verifyStates, statesController.deleteFunFact);

router.get('/:state', verifyStates, statesController.getState);
router.get('/:state/capital', verifyStates, statesController.getCapital);
router.get('/:state/nickname', verifyStates, statesController.getNickname);
router.get('/:state/population', verifyStates, statesController.getPopulation);
router.get('/:state/admission', verifyStates, statesController.getAdmission);

module.exports = router;
