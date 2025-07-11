const authorUpdateController = require('../controllers/authorUpdateController');
const express = require('express')
const router = express.Router();

router.post('/save-page', authorUpdateController.updatePage);
router.post('/save-image', authorUpdateController.saveImage)
router.post('/toggle-feat', authorUpdateController.toggleTopicFeat)

module.exports = router;