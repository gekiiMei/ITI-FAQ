const authorFetchController = require("../controllers/authorFetchController")
const express = require('express')
const router = express.Router();

router.post('/fetch-categories', authorFetchController.get_categories)

module.exports = router;