const userFetchController = require("../controllers/userFetchController")
const express = require('express')
const router = express.Router();

//Selvin: Writer a router.post route with the url "/get-suggestions", which will call userFetchController.get_suggestions
router.get("/get-suggestions", userFetchController.get_suggestions);

module.exports = router;