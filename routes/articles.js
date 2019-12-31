const express = require("express");
const router = express.Router();
const db = require("../models");

//this is the get route to update the "saved" boolean to true
router.get("/save/:id", (req, res) => {
	db.Article
		.update({ _id: req.params.id }, { saved: true })
		.then((result) => res.redirect("/"))
		.catch((err) => res.json(err));
});

//this is the get route to render savedArticles.handlebars and populate it with saved articles
router.get("/viewSaved", (req, res) => {
	db.Article
		.find({})
		.then((result) => res.render("savedArticles", { articles: result }))
		.catch((err) => res.json(err));
});

// this is a delete route to remove an article from savedArticles
router.delete("/deleteArticle/:id", function(req, res) {
	db.Article.remove({ _id: req.params.id }).then((result) => res.json(result)).catch((err) => res.json(err));
});

module.exports = router;
