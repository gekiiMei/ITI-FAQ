const userFetchController = require("../controllers/userFetchController")
const express = require('express')
const router = express.Router();

router.get("/get-suggestions", userFetchController.get_suggestions);
router.get("/search", userFetchController.search)

module.exports = router; 
