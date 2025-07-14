const Topic = require('../models/Topic');
const { Op, Sequelize } = require('sequelize');

exports.get_suggestions = async (req, res) => {
    const currentQuery = req.query['current_query'];
    console.log('Search query:', currentQuery);

    try {
        const results = await Topic.findAll({
            where: {
                title: {
                    [Sequelize.Op.iLike]: `%${currentQuery}%`/*iLike is Postgres exclusive -Selvin*/ 
                },
                is_active: true
            }
        });

        console.log('Matching topics:', results); 
        return res.status(200).json({msg:'successfully search', suggestions: results})
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.search = async (req, res) => {
    const currentQuery = req.query['search_query']
    console.log('searching for ' + currentQuery)
    try {
        const results = await Topic.findAll({
            where: {
                title: {
                    [Sequelize.Op.iLike]: `%${currentQuery}%` //<-- NOTE!!!: iLike is for postgres only. need other case insensitivity solution for other DBs -Harley
                }
            }
        })
        console.log(results)
        return res.status(200).json({msg:'Successfully fetched results', results:results})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:'Unexpected error.'})
    }
}