const express = require("express");
const cheerio = require("cheerio");
const db = require("../models");
const router = express.Router();
const axios = require("axios");

//this is the route to scrape new articles
router.get("/newArticles", function(req, res) {
	const options = {
		url: "https://www.ign.com/",
		transform: function(body) {
			return cheerio.load(body);
		}
	};
	axios
		.get(options.url)
		.then((response) => {
			const $ = cheerio.load(response.data);
			$(".deck-items article").each(function(i, element) {
				const link = "https://www.ign.com" + $(this).find("a").attr("href");
				const headLine = $(this).find(".title-block h3.title").text();
				const summary = $(this).find(".article-sub-headline").text;
				const imgURL = $(this).find(".image-container").attr("src");
				const byLine = $(this).find(".author-link").text();
				// Create a new Article using the `result` object built from scraping
				db.Article
					.create({
						headline: headLine,
						storyUrl: link
					})
					.then(function(dbArticle) {
						// View the added result in the console
						console.log(dbArticle);
					})
					.catch(function(err) {
						// If an error occurred, log it
						console.log(err);
					});
			});
		})
		.catch((error) => console.log(error));
});

module.exports = router;
