  const jwt = require("jsonwebtoken");
  const User=require('../models/user')
  exports.userAuth = async (req, res, next) => {
    const tokeName ="userJwt";
    let token = req.cookies[tokeName];
    if (!token) {
      return res.redirect("/");
    }
    try {
      //use the jwt.verify method to verify the access token
      //throws an error if the token has expired or has a invalid signature
      let decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      let user = await User.findById(decode.id);
        req.user = user;
      next();
    } catch (e) {
      console.log(e);
      return res.redirect("/");
    }
  };
