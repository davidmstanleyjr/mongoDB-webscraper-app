const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const favicon = require("serve-favicon");
const logger = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

//this initializes the app
const app = express();



//this initializes the database
const config = require("./config/database");
mongoose.Promise = Promise;
mongoose
  .connect(config.database)
  .then( result => {
    console.log("Connected to database "${result.connections[0].name}" on ${result.connections[0].host}:${result.connections[0].port}`)
  })
  .catch(err => console.log("Your connecation has an error:", err));

//this adds a favicon 
app.use(favicon(path.join(__dirname, "public", "assets/img/favicon.ico")))

//this sets up Morgan
app.use(logger("dev"));

//this is for body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//this is for handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//this sets up the static directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/articles",express.static(path.join(__dirname, "public")));
app.use("/notes",express.static(path.join(__dirname, "public")));


//Routes
const index = require("./routes/index")
const articles = require("./routes/articles")
const notes = require("./routes/notes")
const scrape = require("./routes/scrape")

app.use("/", index)
app.use("/articles", articles);
app.use("/notes", notes);
app.use("/scrape", scrape);

//this is for starting my server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`)
});