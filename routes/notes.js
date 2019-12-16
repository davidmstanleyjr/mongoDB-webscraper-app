
const express = require("express");
const router = express.Router();
const db = require("../models");


//this is my get route to retrieve all the notes for a particlular article
router.get("/getNotes/:id", function (req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate("notes")
    .then(results => res.json(results))
    .catch(err => res.json(err));
});

//this is my get route to return a single note to view 
router.get("/getSingleNote/:id", function (req,res) {
  db.Note
  .findOne({_id: req.params.id})
  .then( result => res.json(result))
  .catch(err => res.json(err));
});

//this is my post route to create a new note in the database
router.post("/createNote", function (req,res){
  let { title, body, articleId } = req.body;
  let note = {
    title,
    body
  }
  db.Note
    .create(note)
    .then( result => {
      db.Article
        //this saves a reference to note in the corresponding article
        .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})
        .then( data => res.json(result))
        .catch( err => res.json(err));
    })
    .catch(err => res.json(err));
});

//this is my post route to delete a note
router.post("/deleteNote", (req,res)=>{
  let {articleId, noteId} = req.body
  db.Note
    .remove({_id: noteId})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});


module.exports = router;