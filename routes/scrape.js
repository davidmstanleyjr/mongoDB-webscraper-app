const express = require("express");
const rp = require("request-promise");
const cheerio = require ("cheerio");
const db = require("../models");
const router = express.Router();



//this is the route to scrape new articles
router.get("/newArticles", function(req, res) {
    const options = {
      uri: "https://www.ign.com/",
      transform: function (body) {
          return cheerio.load(body);
      }
    };

    console.log(options)
   
   
    //this calls the database to return all of the saved articles
    db.Article
      .find({})
      .then((savedArticles) => {
        let savedHeadlines = savedArticles.map(article => article.headline)
        console.log(savedArticles)
          //this calls the request promise with the options object
          rp(options)
          .then(function ($) {
            let newArticleArr = [];
           
            //this iterates over returned articles, and creates a newArticle object from the data
            $("#latest-panel article.story.theme-summary").each((i, element) => {
              let newArticle = new db.Article({
                storyUrl: $(element).find(".story-body>.story-link").attr("href"),
                headline: $(element).find("h2.headline").text().trim(),
                summary : $(element).find("p.summary").text().trim(),
                imgUrl  : $(element).find("img").attr("src"),
                byLine  : $(element).find("p.byline").text().trim()
              });
             
             
              //this checks to make sure newArticle contains a storyUrl
              if (newArticle.storyUrl) {
                //this checks if new article matches any saved article, if not, this adds it to the array of new articles
                if (!savedHeadlines.includes(newArticle.headline)) {
                  newArticleArr.push(newArticle);
                }
              }
            });
  console.log(newArticleArr, "=============================");
            //this adds all new articles to the database
            db.Article
              .create(newArticleArr)
                //this returns count of new articles to the front end
              .then(result => res.json({count: newArticleArr.length}))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  });
  
  module.exports = router;