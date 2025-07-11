const Topic = require('../models/Topic');
const { Op } = require('sequelize');

exports.get_suggestions = async (req, res) => {
    //Selvin: from req.body, access current_query and store it in the const variable "currentQuery"
    const currentQuery = req.query['current_query']
    //Selvin: console.log that variable after
    console.log('Search query:', currentQuery);
};