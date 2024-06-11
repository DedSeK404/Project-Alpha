const userModel = require("../models/userModel");
const { hashPwd, comparePwd } = require("../tools/PasswordHandler");
const createtoken = require("../tools/Token");

module.exports.Signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ msg: "L'utilisateur existe déjà." });
    }

    const hashed = await hashPwd(password);
    const user = new userModel({ ...req.body, password: hashed });
    await user.save();
    res.send({ msg: "L'utilisateur a été créé avec succès.", user: user });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).send({
        msg: "Aucun compte n'est associé à cet e-mail. Veuillez vérifier que vous l'avez saisi correctement.",
      });
    }

    const match = await comparePwd(password, existingUser.password);

    if (!match) {
      return res
        .status(400)
        .send({ msg: "Le mot de passe que vous avez saisi est incorrect." });
    }
    const payload = { userID: existingUser._id };
    const token = createtoken(payload);
    existingUser.password = undefined;
    res.send({
      token,
      msg: "Connexion réussie",
      user: existingUser,
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.getCurrentUser = (req, res) => {
  try {
    res.send({ user: req.user });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
