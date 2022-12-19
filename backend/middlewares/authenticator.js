const authenticate = (req, res, next) => {
  if (req.session.authenticated) {
    next()
  } else {
    // res.redirect("/login")
    next()
  }
}

module.exports = authenticate
