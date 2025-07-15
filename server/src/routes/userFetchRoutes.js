const userFetchController = require("../controllers/userFetchController")
const express = require('express')
const router = express.Router();

router.get("/get-suggestions", userFetchController.get_suggestions); // should be fetch-suggestions, fix this and instances -harley
router.get("/fetch-featured", userFetchController.get_featured)
router.get("/search", userFetchController.search)

module.exports = router; 
