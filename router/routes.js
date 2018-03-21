const User = require("../models/User");
const Todo = require("../models/Todo");
const bcrypt = require("bcrypt");
const mid = require("../middleware/middleware");

module.exports = (app, flash) => {
  app.get("/", mid.requiresLoggedIn, (req, res) => {
    User.findById(req.session.userId).populate("todos").exec((err, user) => {
      if(err) {
        console.log(err);
      } else {
        const todos = user.todos;
        res.render('home', { tasks: todos });
      }
    });
  });

  app.get("/register", mid.requiresLoggedOut, (req, res) => {
    res.render("register");
  });

  app.post("/register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if(username && email && password) {
      bcrypt.hash(password, 10, (err, password) => {
        if(err) {
          req.flash("error", "Something went wrong!");
          res.redirect("/register");
        } else {
          User.create({username, email, password}, (err, user) => {
            if(err) {
              req.flash("error", "Something went wrong while creating an account for you!");
              res.redirect("/register");
            } else {
              req.flash("info", "Your account has been created, you can log in now!");
              res.redirect("/login");
            }
          });
        }
      });
    } else {
      req.flash("error", "All fields are required!");
      res.redirect("/register");
    }
  });

  app.get("/login", mid.requiresLoggedOut, (req, res) => {
    res.render("login");
  });

  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(email && password) {
      User.findOne({email: email}, (err, user) => {
        if(err) {
          console.log(err);
        } else {
          if(!user) {
            req.flash("error", "User account does not exist!");
            res.redirect("/register");
          } else {
            bcrypt.compare(password, user.password, (err, result) => {
              if(err) {
                console.log(err);
              } else {
                if(result === true) {
                  req.session.userId = user._id;
                  req.flash("success", "You have successfully logged in!");
                  res.redirect("/");
                } else {
                  req.flash("error", "Password does not match!");
                  res.redirect("/login");
                }
              }
            });
          }
        }
      });
    } else {
      req.flash("error", "All fields are required!");
      res.redirect("/login");
    }
  });

  app.get("/logout", mid.requiresLoggedIn, (req, res) => {
    if (req.session && req.session.userId) {
      req.session.destroy(err => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/login");
        }
      });
    }
  });

  app.post("/task", (req, res) => {
    Todo.create({task: req.body.task}, (err, task) => {
      if(err) {
        console.log(err);
      } else {
        User.findById(req.session.userId, (err, user) => {
          if(err) {
            console.log(err);
          } else {
            user.todos.push(task);
            user.save();
            req.flash("success", "Your to do task has been added!");
            res.redirect("/");
          }
        });
      }
    });
  });

  app.get("/mark/:id", (req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err) => {
      if(err) {
        console.log(err);
      } else {
        req.flash("success", "Your to do task has been completed!");
        res.redirect("/");
      }
    })
  });

  app.get("*", (req, res) => {
    res.render("notFound");
  });
};
