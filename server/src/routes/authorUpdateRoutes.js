const authorUpdateController = require('../controllers/authorUpdateController');
const express = require('express')
const router = express.Router();

router.post('/save-page', authorUpdateController.updatePage);
router.post('/save-image', authorUpdateController.saveImage)
router.post('/update-thumbnail', authorUpdateController.updateThumbnail)
router.post('/toggle-feat', authorUpdateController.toggleTopicFeat)
router.post('/update-rating', authorUpdateController.updateRatings)
router.post('/rename-topic', authorUpdateController.renameTopic)

module.exports = router;