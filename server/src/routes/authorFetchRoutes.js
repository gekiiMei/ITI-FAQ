const authorFetchController = require("../controllers/authorFetchController")
const express = require('express')
const router = express.Router();

router.post('/fetch-categories', authorFetchController.get_categories)
router.post('/fetch-topics', authorFetchController.get_topics)

module.exports = router;