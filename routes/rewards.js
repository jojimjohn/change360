const express = require('express');
const rewardPointsController = require('../controllers/rewardPointsController');
const router = express.Router();

router.post('/', rewardPointsController.addRewardPoints);
router.get('/:userId', rewardPointsController.getRewardPoints);

module.exports = router;