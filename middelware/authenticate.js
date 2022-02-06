function authentication(req, res, next) {
  console.log("Authenticated..");
  next();
}
module.exports = authentication;
