const express = require('express');
const router = express.Router();
const db = require('../models');

//this is my get route to root, which populates index.handlebars with articles
router.get('/', (req, res) => {
	db.Article.find({}).then((articles) => res.render('index', { articles })).catch((err) => res.json(err));
});

module.exports = router;
