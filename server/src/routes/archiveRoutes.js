const archiveController = require("../controllers/archiveController")
const express = require('express')
const router = express.Router();

router.post('/archive-category', archiveController.archive_category)
router.post('/archive-subject', archiveController.archive_subject)
router.post('/archive-page', archiveController.archive_page)
router.post('/archive-topic', archiveController.archive_topic)

module.exports = router;