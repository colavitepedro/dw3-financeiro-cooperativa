const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mdlLogin = require("../model/mdlLogin");

const Login = async (req, res, next) => {
   try {
      const { username, password } = req.body;
      if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
         return res.status(400).json({ auth: false, message: "Informe usuário e senha." });
      }

      const credenciais = await mdlLogin.GetCredencial(username.trim());
      if (!credenciais.length || !(await bcrypt.compare(password, credenciais[0].password))) {
         return res.status(401).json({ auth: false, message: "Usuário ou senha inválidos." });
      }

      const token = jwt.sign(
         { id: credenciais[0].id, username: credenciais[0].username },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
      );

      return res.json({ auth: true, token, username: credenciais[0].username });
   } catch (error) {
      return next(error);
   }
};

module.exports = { Login };
