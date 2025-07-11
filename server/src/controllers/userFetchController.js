const Topic = require('../models/Topic');
const { Op } = require('sequelize');

exports.get_suggestions = async (req, res) => {
    const currentQuery = req.query['current_query']
    console.log('Search query:', currentQuery);
    //Selvin: Query the Topic model using the findAll() function from Sequelize. Example query:
    /*
    const activeTopics = await Topic.findAll({
        where: {
            is_active:true
        }
    })

    This queries all topics where the column is_active is set to true, then stores the results in active topics.
    Now, for searching we're going to use the LIKE clause.

    In SQL, it's written as 
    SELECT * FROM Table WHERE columnName LIKE '%searchquery%'

    In sequelize, we need to grab it from the Op class. The query above would look like:

    const results = await Table.findAll({
        where:{
            columnName: {
                [Op.like]:`%${searchquery}%`
            }
        }
    })

    You need to do the same thing, except you'll be querying from the Topic model. The columnName will be title, since we're searching titles.
    'searhcquerry' will be currentQuery since that's where we store the query that we got from the frontend axios fetch

    After everything, console.log the variable where you stored the results so we can check.
    */
    
};