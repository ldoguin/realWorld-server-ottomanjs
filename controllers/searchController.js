const asyncHandler = require('express-async-handler');
const {SearchQuery} = require('couchbase')
const {getModel, Query, getDefaultInstance} = require('ottoman');
const Article = getModel('Article');
const {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'SearchController',
});

const searchArticles = asyncHandler( async (req, res) => {

    const {term} = req.query;

    if (!term){
       return res.status(400).json({
        message: "A term must be supplied as a query parameter."
       })
    }   

    const ottoman = getDefaultInstance();
    const cluster = ottoman.cluster;
    const indexName = "articles";
    const query = SearchQuery.match(term)
    try {
        const result = await cluster.searchQuery(indexName, query)
        res.status(200).json({
            results: result.rows
        });
    } catch(e) {
        Logger.error(e, "search failed")
        res.status(500).json({
            message: "Something went wrong searching for articles"
        })
    }

});

module.exports = {
    searchArticles
}
