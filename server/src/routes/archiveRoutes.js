const archiveController = require("../controllers/archiveController")
const express = require('express')
const router = express.Router();

router.post('/archive-category', archiveController.archive_category)
router.post('/archive-subject', archiveController.archive_subject)

module.exports = router;