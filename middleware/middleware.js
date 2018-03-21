function requiresLoggedIn(req, res, next) {
  if(!req.session.userId) {
    req.flash("error", "You must log in first!");
    res.redirect("/login");
  } else {
    next();
  }
}

function requiresLoggedOut(req, res, next) {
  if (req.session.userId) {
    req.flash("info", "You cannot access this route!");
    res.redirect("/");
  } else {
    next();
  }
}

module.exports.requiresLoggedIn = requiresLoggedIn;
module.exports.requiresLoggedOut = requiresLoggedOut;
