const express = require("express");
const router = express.Router();
const Modele = require("../modele/Modele"); // Import du nouveau fichier JavaScript

router.post("/", async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    try {
        const utilisateur = await Modele.verifierUtilisateur(email, mot_de_passe); // Appel de la méthode JS
        if (utilisateur) {
            res.status(200).json({ utilisateur }); // Retourne l'utilisateur trouvé
        } else {
            res.status(404).json({ message: "Email ou mot de passe incorrect !" });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
