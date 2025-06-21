const express = require("express");
const router = express.Router();
const dbConnection = require("../utils/dbConnection");
const bcrypt = require("bcrypt");

// Route de connexion
router.post("/", async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });
  }

  try {
    // 🔍 Requête SQL pour récupérer l'utilisateur par email
    const query = "SELECT * FROM Utilisateur WHERE email = ?";
    const [rows] = await dbConnection.execute(query, [email]);
    const utilisateur = rows[0];

    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect !" });
    }

    // 🔐 Comparaison du mot de passe avec le hash dans la base de données
    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect !" });
    }

    // ✅ Connexion réussie, retour de l'utilisateur
    res.status(200).json({ utilisateur });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

module.exports = router;
