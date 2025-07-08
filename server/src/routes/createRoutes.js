const createController = require('../controllers/createController');
const express = require('express')
const router = express.Router();

router.post('/create-category', createController.create_category)
router.post('/create-topic', createController.create_topic)
router.post('/create-subject', createController.create_subject)
router.post('/create-page', createController.create_page)

module.exports = router;