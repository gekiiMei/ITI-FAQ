const Page  = require('../models/Page');
const Topic = require('../models/Topic');
const { Op, Sequelize } = require('sequelize');

exports.get_suggestions = async (req, res) => {
    const currentQuery = req.query['current_query'];
    console.log('Search query:', currentQuery);

    try {
        const results_topics = await Topic.findAll({
            where: {
                title: {
                    [Sequelize.Op.iLike]: `%${currentQuery}%` // iLike is Postgres exclusive
                },
                is_active: true
            }
        });

        const results_pages = await Page.findAll({
            where: {
                title: {
                    [Sequelize.Op.iLike]: `%${currentQuery}%`/*iLike is Postgres exclusive -Selvin*/ 
                },
                is_active: true
            }
        });

        console.log('Matching topics:', results_topics);
        console.log('Matching pages:', results_pages);

        const results = {
            topics: results_topics,
            pages: results_pages
        };

        return res.status(200).json({ msg: 'Successfully searched', suggestions: results });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.search = async (req, res) => {
    const currentQuery = req.query['search_query']
    const sortMethod = req.query['sort_method']
    console.log('searching for ' + currentQuery)
    console.log('sorting method: ' + sortMethod)
    try {
        const results_topics = await Topic.findAll({
            attributes: {
                include:[
                    [Sequelize.literal("CASE WHEN rating_count = 0 THEN 0 ELSE CAST(total_rating AS FLOAT) / rating_count END", 'ASC'), 'avg_rating']
                ]
            },
            where: {
                title: {
                    [Sequelize.Op.iLike]: `%${currentQuery}%` //<-- NOTE!!!: iLike is for postgres only. need other case insensitivity solution for other DBs -Harley
                }
            },
            order: sortMethod=="date"?
            [['updatedAt', 'DESC'], ['avg_rating', 'DESC']]:
            [['avg_rating', 'DESC'], ['updatedAt', 'DESC']]
        })
        const results_pages = await Page.findAll({
            include: [
                {
                    model: Topic,
                    as: 'parentTopic',
                    attributes:['title']
                }
            ],
            where: {
                title: {
                    [Sequelize.Op.iLike]: `%${currentQuery}%`/*iLike is Postgres exclusive -Selvin*/ 
                },
                is_active: true
            },
            order:[['updatedAt', 'DESC']]
        });
        console.log(results_topics)
        console.log(results_pages)
        return res.status(200).json({msg:'Successfully fetched results', results_topics:results_topics, results_pages:results_pages})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:'Unexpected error.'})
    }
}