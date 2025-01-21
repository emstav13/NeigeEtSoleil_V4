const express = require("express");
const mysql = require("mysql2"); // Assure-toi que mysql2 est installé
const router = express.Router();

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Remplace par ton utilisateur MySQL
    password: "0000", // Remplace par ton mot de passe MySQL
    database: "NeigeEtSoleil_V4", // Nom de ta base de données
    port: 3307, // Remplace par le port correct si différent        
});

// Route d'inscription
router.post("/", async (req, res) => {
    const userData = req.body; // Récupère les données envoyées par le formulaire
    console.log("Données reçues du formulaire :", userData);

    // Vérification des données côté serveur
    if (!userData.nom || !userData.prenom || !userData.email || !userData.motDePasse || !userData.role) {
        console.error("Erreur : Tous les champs sont obligatoires.");
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    try {
        // Insère les données dans la base de données
        const sql = `
            INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, date_creation)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const values = [
            userData.nom,
            userData.prenom,
            userData.email,
            userData.motDePasse,
            userData.role,
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Erreur lors de l'insertion dans la base de données :", err.message);
                return res.status(500).json({ message: "Erreur lors de l'enregistrement dans la base de données." });
            }

            console.log("Utilisateur inséré avec succès :", result);
            res.status(201).json({ message: "Utilisateur inscrit avec succès et enregistré dans la base de données !" });
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error.message);
        res.status(500).json({ message: "Une erreur est survenue lors de l'inscription." });
    }
});

module.exports = router;
