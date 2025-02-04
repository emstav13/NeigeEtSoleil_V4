const express = require("express");
const mysql = require("mysql2"); // Assure-toi que mysql2 est installé
const bcrypt = require("bcrypt"); // 📌 Pour le hachage du mot de passe
const router = express.Router();
const db = require("../utils/dbConnection"); // 📌 Utilisation de la connexion partagée

// Route d'inscription
router.post("/", async (req, res) => {
    const { nom, prenom, email, motDePasse, role } = req.body;
    console.log("Données reçues du formulaire :", req.body);

    if (!nom || !prenom || !email || !motDePasse || !role) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    try {
        // 📌 Vérifier si l'email existe déjà
        const [existingUsers] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // 📌 Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // 📌 Insérer l'utilisateur
        const sql = `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, date_creation) VALUES (?, ?, ?, ?, ?, NOW())`;
        const [result] = await db.query(sql, [nom, prenom, email, hashedPassword, role]);

        console.log("✅ Utilisateur inséré avec succès :", result);
        res.status(201).json({ message: "Inscription réussie !" });
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error.message);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

module.exports = router;
