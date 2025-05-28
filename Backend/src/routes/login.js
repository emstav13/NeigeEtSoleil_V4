const express = require("express");
const router = express.Router();
const dbConnection = require("../utils/dbConnection");
const bcrypt = require("bcrypt");

// ✅ Route de connexion
router.post("/", async (req, res) => {
  console.log("📥 BODY ENTIER :", req.body);

  let { email, mot_de_passe } = req.body;

  // ✅ Sécuriser les entrées
  email = email?.trim();
  mot_de_passe = mot_de_passe?.trim();

  console.log("📨 Tentative de connexion");
  console.log("📧 Email reçu:", email);
  console.log("🔑 Mot de passe reçu:", mot_de_passe);

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });
  }

  try {
    // ✅ DEBUG: Afficher la configuration DB
    console.log("🧪 TEST de connexion SQL");
    console.log("📍 Configuration DB:");
    console.log("host:", process.env.DB_HOST);
    console.log("user:", process.env.DB_USER);
    console.log("password:", process.env.DB_PASSWORD);
    console.log("database:", process.env.DB_NAME);
    console.log("port:", process.env.DB_PORT);

    // ✅ Exécution de la requête
    const query = "SELECT * FROM utilisateur WHERE email = ?";
    const [rows] = await dbConnection.execute(query, [email]);
    const utilisateur = rows[0];

    if (!utilisateur) {
      console.warn("⚠️ Utilisateur introuvable");
      return res.status(401).json({ message: "Email ou mot de passe incorrect !" });
    }

    console.log("🔐 Hash en base:", utilisateur.mot_de_passe);

    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    console.log("🔍 Résultat de bcrypt.compare:", isMatch);

    if (!isMatch) {
      console.warn("❌ Mot de passe incorrect");
      return res.status(401).json({ message: "Email ou mot de passe incorrect !" });
    }

    // ✅ Supprimer le mot de passe du résultat
    delete utilisateur.mot_de_passe;

    console.log("✅ Connexion réussie pour:", utilisateur.email);
    res.status(200).json({ utilisateur });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({
      message: "Erreur interne du serveur.",
      debug: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
