const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");

// 💆 4️⃣ Récupérer uniquement les activités de détente
router.get("/detente", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ag.id_activite, ag.nom_activite, ag.id_station, ag.image, 
                   d.type_detente, d.prix_entre
            FROM activite_detente d
            JOIN activite_generale ag ON d.id_activite = ag.id_activite
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des activités de détente :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});



// 🏋️‍♂️ 2️⃣ Récupérer uniquement les activités sportives
router.get("/sportives", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ag.id_activite, ag.nom_activite, ag.id_station, ag.image, 
                   s.type_sport, s.niveau_difficulte
            FROM activite_sportive s
            JOIN activite_generale ag ON s.id_activite = ag.id_activite
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des activités sportives :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


// 🎭 3️⃣ Récupérer uniquement les activités culturelles
router.get("/culturelles", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ag.id_activite, ag.nom_activite, ag.id_station, ag.image, 
                   c.duree, c.public_cible
            FROM activite_culturelle c
            JOIN activite_generale ag ON c.id_activite = ag.id_activite
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des activités culturelles :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


// 💆 4️⃣ Récupérer uniquement les activités de détente
router.get("/detente", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ag.id_activite, ag.nom_activite, ag.id_station, ag.image, 
                   d.type_detente, d.prix_entre
            FROM activite_detente d
            JOIN activite_generale ag ON d.id_activite = ag.id_activite
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des activités de détente :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


// ➕ 5️⃣ Ajouter une nouvelle activité (générale + spécifique)
router.post("/ajouter", async (req, res) => {
    const { nom_activite, id_station, type, type_sport, niveau_difficulte, duree, public_cible, type_detente, prix_entre } = req.body;

    if (!nom_activite || !id_station || !type) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    try {
        // Insérer dans activite_generale
        const sqlGenerale = "INSERT INTO activite_generale (nom_activite, id_station) VALUES (?, ?)";
        const [result] = await db.query(sqlGenerale, [nom_activite, id_station]);
        const idActivite = result.insertId;

        let sqlSpecifique = "";
        let params = [];

        // Insérer selon le type d’activité
        switch (type) {
            case "sportive":
                sqlSpecifique = "INSERT INTO activite_sportive (id_activite, type_sport, niveau_difficulte) VALUES (?, ?, ?)";
                params = [idActivite, type_sport, niveau_difficulte];
                break;
            case "culturelle":
                sqlSpecifique = "INSERT INTO activite_culturelle (id_activite, duree, public_cible) VALUES (?, ?, ?)";
                params = [idActivite, duree, public_cible];
                break;
            case "detente":
                sqlSpecifique = "INSERT INTO activite_detente (id_activite, type_detente, prix_entre) VALUES (?, ?, ?)";
                params = [idActivite, type_detente, prix_entre];
                break;
            default:
                return res.status(400).json({ error: "Type d'activité invalide" });
        }

        await db.query(sqlSpecifique, params);
        res.status(201).json({ message: "Activité ajoutée avec succès", id_activite: idActivite });

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout d'une activité :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ❌ 6️⃣ Supprimer une activité
router.delete("/supprimer/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const sql = "DELETE FROM activite_generale WHERE id_activite = ?";
        await db.query(sql, [id]);
        res.status(200).json({ message: "Activité supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'activité :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🔄 7️⃣ Mettre à jour une activité
router.put("/modifier/:id", async (req, res) => {
    const { id } = req.params;
    const { nom_activite, id_station } = req.body;

    if (!nom_activite || !id_station) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    try {
        const sql = "UPDATE activite_generale SET nom_activite = ?, id_station = ? WHERE id_activite = ?";
        await db.query(sql, [nom_activite, id_station, id]);
        res.status(200).json({ message: "Activité mise à jour avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de l'activité :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;
