const jwt = require("jsonwebtoken");

function AutenticaJWT(req, res, next) {
   const authorization = req.headers.authorization;

   if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ auth: false, message: "Token não informado." });
   }

   const token = authorization.slice(7);

   try {
      req.usuario = jwt.verify(token, process.env.JWT_SECRET);
      next();
   } catch (error) {
      return res.status(401).json({ auth: false, message: "Token inválido ou expirado." });
   }
}

module.exports = AutenticaJWT;
