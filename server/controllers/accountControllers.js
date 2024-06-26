const userModel = require("../models/userModel");
const { hashPwd } = require("../tools/PasswordHandler");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file"); 

const path = require("path");
const fs = require("fs");

module.exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await userModel.find(
      { role: { $in: ["student", "teacher"] } },
      { password: 0 }
    );

    res.send({ accounts });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ msg: "Utilisateur introuvable." });
    }

    for (const key in updates) {
      if (updates[key]) {
        if (key === "password") {
          user[key] = await hashPwd(updates[key]);
        } else {
          user[key] = updates[key];
        }
      }
    }

    user = await user.save();

    user.password = undefined;

    res.send({ msg: "L'utilisateur a été mis à jour avec succès.", user });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.uploadProfileImage = async (req, res) => {
  const userId = req.params.id;

  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ msg: "Utilisateur introuvable" });
    }

    upload(req, res, async function (err) {
      try {
        if (err) {
          console.error("Une erreur est survenue pendant le chargement:", err);
          return res
            .status(400)
            .send({ msg: "Une erreur est survenue pendant le chargement:", error: err });
        }

        if (!req.file) {
          return res.status(400).send({ msg: "Aucun fichier téléchargé." });
        }

        // Get the file path from req.file
        const filePath = req.file.path;

        // Update user's profile image path in the database
        user.img = filePath;
        await user.save();

        res.send({ msg: "Votre photo de profil a été mise à jour avec succès.", filePath });
      } catch (error) {
        res.status(500).send({ msg: error.message });
      }
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.getOneAccount = async (req, res) => {
  const { id } = req.params; // Extracting id from req.params

  try {
    const account = await userModel.findById(id); // Using findById to find the account by id

    res.send({ account });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
