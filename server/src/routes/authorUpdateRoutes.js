const authorUpdateController = require('../controllers/authorUpdateController');
const express = require('express')
const router = express.Router();

router.post('/save-page', authorUpdateController.updatePage);


module.exports = router;