const express = require("express");
const chalk = require("chalk");
const hbs = require("hbs");
const session = require("express-session");
const StoreMongo = require("connect-mongo")(session);
const flash = require("connect-flash");
const bodyParser = require("body-parser");

const db = require("./database/db");

const port = process.env.PORT || 5000;

hbs.registerPartials('views/includes');

const app = express();

app.use(session({
  secret: "My NodeJS App",
  resave: true,
  saveUninitialized: false,
  store: new StoreMongo({
    mongooseConnection: db.db
  })
}));

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  res.locals.errorMessage = req.flash("error");
  res.locals.infoMessage = req.flash("info");
  res.locals.successMessage = req.flash("success");
  next();
});

require('./router/routes')(app, flash);

app.listen(port, () => {
  console.log(chalk.green(`The server is running on http://localhost:${port}`));
});
