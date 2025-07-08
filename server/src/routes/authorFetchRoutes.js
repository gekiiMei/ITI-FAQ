const authorFetchController = require("../controllers/authorFetchController")
const express = require('express')
const router = express.Router();

router.post('/fetch-categories', authorFetchController.get_categories)
router.post('/fetch-topics', authorFetchController.get_topics)
router.post('/fetch-subjects', authorFetchController.get_subjects)
router.post('/fetch-pages', authorFetchController.get_pages)
router.post('/fetch-details', authorFetchController.get_page_details)

module.exports = router;