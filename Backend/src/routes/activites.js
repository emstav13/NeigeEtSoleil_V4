const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");


// 🏋️‍♂️ 2️⃣ Récupérer uniquement les activités sportives
router.get("/sportives", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                ag.id_activite, 
                ag.nom_activite, 
                ag.image, 
                st.nom AS station_nom,  -- ✅ Récupération du nom de la station
                s.type_sport, 
                s.niveau_difficulte, 
                t.prix  -- ✅ Récupération du prix
            FROM activite_sportive s
            JOIN activite_generale ag ON s.id_activite = ag.id_activite
            LEFT JOIN station st ON ag.id_station = st.id_station  -- ✅ Jointure pour récupérer le nom de la station
            LEFT JOIN tarif t ON ag.id_activite = t.id_activite  -- ✅ Jointure pour récupérer le prix
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
            SELECT ag.id_activite, ag.nom_activite, ag.image, 
                   c.duree, c.public_cible, 
                   s.nom AS station_nom,  -- 🔹 Ajout du nom de la station
                   t.prix                 -- 🔹 Ajout du prix
            FROM activite_culturelle c
            JOIN activite_generale ag ON c.id_activite = ag.id_activite
            LEFT JOIN station s ON ag.id_station = s.id_station  -- 🔹 Associer avec la station
            LEFT JOIN tarif t ON ag.id_activite = t.id_activite  -- 🔹 Associer avec les tarifs
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
        const sql = `
                        SELECT 
    ad.id_activite, 
    ag.nom_activite,   
    ad.type_detente, 
    ad.description, 
    ag.image,  
    s.nom AS station_nom,
    t.prix AS prix
FROM activite_detente ad
JOIN activite_generale ag ON ad.id_activite = ag.id_activite  
LEFT JOIN station s ON ag.id_station = s.id_station
LEFT JOIN tarif t ON ad.id_activite = t.id_activite

   `;
        const [rows] = await db.query(sql);
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
