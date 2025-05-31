const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");


/**********************************
 * 🌍 ROUTES CLIENT - Récupération
 **********************************/


// 📅 Route : Récupérer les réservations d'activités d'un utilisateur
router.get("/mes-reservations/:id_utilisateur", async (req, res) => {
    const { id_utilisateur } = req.params;

    try {
        const sql = `
            SELECT ra.id_reservation, ag.nom_activite, ra.date_reservation, ra.nombre_personnes, ra.prix_total
            FROM reservation_activite ra
            JOIN activite_generale ag ON ra.id_activite = ag.id_activite
            WHERE ra.id_utilisateur = ?
            ORDER BY ra.date_reservation DESC
        `;
        const [rows] = await db.query(sql, [id_utilisateur]);

        // ✅ Si aucune réservation, on renvoie un tableau vide avec un 200 OK
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des réservations d'activités :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});



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

// Route POST pour réserver une activité
router.post("/reserver", async (req, res) => {
    const { id_utilisateur, id_activite, date_reservation, nombre_personnes, prix_total } = req.body;
  
    if (!id_utilisateur || !id_activite || !date_reservation || !nombre_personnes || !prix_total) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }
  
    try {
      const query = `
        INSERT INTO reservation_activite (id_utilisateur, id_activite, date_reservation, nombre_personnes, prix_total)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.query(query, [id_utilisateur, id_activite, date_reservation, nombre_personnes, prix_total]);
      
      res.status(201).json({ message: "Réservation enregistrée avec succès !" });
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réservation :", error);
      res.status(500).json({ error: "Erreur serveur. Veuillez réessayer plus tard." });
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
                sqlSpecifique = "INSERT INTO activite_detente (id_activite, type_detente, description) VALUES (?, ?, ?)";
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


/**********************************
 * ⚙️ ROUTES ADMIN - Gestion des activités
 **********************************/

// Fonction pour supprimer les clés ayant une valeur `null`
function cleanObject(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}


// 🔄 4️⃣ Récupérer toutes les activités pour l'administration
router.get("/admin", async (req, res) => {
    try {
        const sql = `
            SELECT 
                ag.id_activite, 
                ag.nom_activite, 
                ag.image,
                st.nom AS station_nom,
                t.prix AS prix,
                CASE 
                    WHEN s.id_activite IS NOT NULL THEN 'sportive' 
                    WHEN c.id_activite IS NOT NULL THEN 'culturelle' 
                    WHEN d.id_activite IS NOT NULL THEN 'detente' 
                    ELSE 'autre' 
                END AS type_activite,
                s.type_sport,
                s.niveau_difficulte,
                c.duree,
                c.public_cible,
                d.type_detente,
                d.description AS description_detente
            FROM activite_generale ag
            LEFT JOIN station st ON ag.id_station = st.id_station
            LEFT JOIN tarif t ON ag.id_activite = t.id_activite
            LEFT JOIN activite_sportive s ON ag.id_activite = s.id_activite
            LEFT JOIN activite_culturelle c ON ag.id_activite = c.id_activite
            LEFT JOIN activite_detente d ON ag.id_activite = d.id_activite
            WHERE s.id_activite IS NOT NULL 
               OR c.id_activite IS NOT NULL 
               OR d.id_activite IS NOT NULL;
        `;

        const [rows] = await db.query(sql);

        // Nettoyer chaque objet pour enlever les valeurs nulles
        const cleanRows = rows.map(cleanObject);

        res.status(200).json(cleanRows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des activités admin :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


/**********************************
 * 🔍 8️⃣ Recherche et filtrage des activités
 **********************************/
router.get("/admin/recherche", async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ error: "Paramètre de recherche manquant." });
    }

    try {
        const sql = `
            SELECT 
                ag.id_activite, 
                ag.nom_activite, 
                ag.image,
                s.nom AS station_nom,
                t.prix,
                asport.type_sport,
                asport.niveau_difficulte,
                acult.duree,
                acult.public_cible,
                adet.type_detente,
                adet.description AS description_detente
            FROM activite_generale ag
            LEFT JOIN station s ON ag.id_station = s.id_station
            LEFT JOIN tarif t ON ag.id_activite = t.id_activite
            LEFT JOIN activite_sportive asport ON ag.id_activite = asport.id_activite
            LEFT JOIN activite_culturelle acult ON ag.id_activite = acult.id_activite
            LEFT JOIN activite_detente adet ON ag.id_activite = adet.id_activite
            WHERE ag.nom_activite LIKE ? 
               OR asport.type_sport LIKE ?
               OR acult.public_cible LIKE ?
               OR adet.type_detente LIKE ?
               OR adet.description LIKE ?
        `;
        
        const [rows] = await db.query(sql, [
            `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`
        ]);

        // Supprime les champs null avant de renvoyer la réponse
        const cleanedRows = rows.map(cleanObject);

        res.status(200).json(cleanedRows);
    } catch (error) {
        console.error("❌ Erreur lors de la recherche d'activités :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🔍 Récupérer une activité par son ID pour l'édition
router.get("/admin/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                ag.id_activite, 
                ag.nom_activite, 
                ag.image, 
                st.nom AS station_nom,
                t.prix AS prix,
                CASE 
                    WHEN s.id_activite IS NOT NULL THEN 'sportive' 
                    WHEN c.id_activite IS NOT NULL THEN 'culturelle' 
                    WHEN d.id_activite IS NOT NULL THEN 'detente' 
                    ELSE 'autre' 
                END AS type_activite,
                s.type_sport,
                s.niveau_difficulte,
                c.duree,
                c.public_cible,
                d.type_detente,
                d.description AS description_detente
            FROM activite_generale ag
            LEFT JOIN station st ON ag.id_station = st.id_station
            LEFT JOIN tarif t ON ag.id_activite = t.id_activite
            LEFT JOIN activite_sportive s ON ag.id_activite = s.id_activite
            LEFT JOIN activite_culturelle c ON ag.id_activite = c.id_activite
            LEFT JOIN activite_detente d ON ag.id_activite = d.id_activite
            WHERE ag.id_activite = ?;
        `;

        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Activité non trouvée." });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'activité :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ➕ 5️⃣ Ajouter une nouvelle activité
router.post("/admin", async (req, res) => {
    const { nom_activite, id_station, type, type_sport, niveau_difficulte, duree, public_cible, type_detente, prix } = req.body;

    if (!nom_activite || !id_station || !type || !prix) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    try {
        // 1️⃣ Insérer dans `activite_generale`
        const sqlGenerale = "INSERT INTO activite_generale (nom_activite, id_station) VALUES (?, ?)";
        const [result] = await db.query(sqlGenerale, [nom_activite, id_station]);
        const idActivite = result.insertId;

        // 2️⃣ Insérer dans la table spécifique en fonction du type d'activité
        let sqlSpecifique = "";
        let params = [];

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
                sqlSpecifique = "INSERT INTO activite_detente (id_activite, type_detente) VALUES (?, ?)";
                params = [idActivite, type_detente];
                break;
            default:
                return res.status(400).json({ error: "Type d'activité invalide" });
        }

        await db.query(sqlSpecifique, params);

        // 3️⃣ Insérer le prix dans `tarif`
        const sqlTarif = "INSERT INTO tarif (id_activite, id_saison, prix) VALUES (?, 1, ?)"; // ⚠️ Id_saison mis à 1 par défaut
        await db.query(sqlTarif, [idActivite, prix]);

        res.status(201).json({ message: "Activité ajoutée avec succès", id_activite: idActivite });

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout d'une activité :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});



// ✏️ 6️⃣ Modifier une activité
router.put("/admin/:id", async (req, res) => {
    const { id } = req.params;
    const { nom_activite, id_station, type_sport, niveau_difficulte, duree, public_cible, description, prix } = req.body;

    if (!nom_activite || !id_station) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    try {
        // 🔍 Détecter automatiquement le type d’activité
        const [result] = await db.query(`
            SELECT 
                CASE 
                    WHEN EXISTS (SELECT 1 FROM activite_sportive WHERE id_activite = ?) THEN 'sportive'
                    WHEN EXISTS (SELECT 1 FROM activite_culturelle WHERE id_activite = ?) THEN 'culturelle'
                    WHEN EXISTS (SELECT 1 FROM activite_detente WHERE id_activite = ?) THEN 'detente'
                    ELSE NULL
                END AS type_activite
            FROM dual
        `, [id, id, id]);

        const type = result[0]?.type_activite;
        if (!type) {
            return res.status(400).json({ error: "Activité non trouvée ou type inconnu." });
        }

        // ✅ Mise à jour de l'activité générale (nom et station uniquement)
        const sqlGenerale = "UPDATE activite_generale SET nom_activite = ?, id_station = ? WHERE id_activite = ?";
        await db.query(sqlGenerale, [nom_activite, id_station, id]);

        // ✅ Mise à jour selon le type d’activité détecté
        switch (type) {
            case "sportive":
                if (type_sport && niveau_difficulte) {
                    await db.query("UPDATE activite_sportive SET type_sport = ?, niveau_difficulte = ? WHERE id_activite = ?", 
                                   [type_sport, niveau_difficulte, id]);
                }
                break;
            case "culturelle":
                if (duree && public_cible) {
                    await db.query("UPDATE activite_culturelle SET duree = ?, public_cible = ? WHERE id_activite = ?", 
                                   [duree, public_cible, id]);
                }
                break;
            case "detente":
                if (description) {
                    await db.query("UPDATE activite_detente SET description = ? WHERE id_activite = ?", 
                                   [description, id]);
                }
                break;
            default:
                return res.status(400).json({ error: "Type d'activité invalide" });
        }

        // ✅ Mise à jour du prix si fourni
        if (prix) {
            const sqlCheckTarif = "SELECT COUNT(*) AS count FROM tarif WHERE id_activite = ?";
const [tarifExists] = await db.query(sqlCheckTarif, [id]);

if (tarifExists[0].count > 0) {
    // Si un tarif existe, on le met à jour
    const sqlUpdateTarif = "UPDATE tarif SET prix = ? WHERE id_activite = ?";
    await db.query(sqlUpdateTarif, [prix, id]);
} else {
    // Sinon, on insère un nouveau tarif
    const sqlInsertTarif = "INSERT INTO tarif (id_activite, id_saison, prix) VALUES (?, 1, ?)";
    await db.query(sqlInsertTarif, [id, prix]); // id_saison = 1 par défaut (ajuste selon besoin)
}

        }

        res.status(200).json({ message: "Activité mise à jour avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de l'activité :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});





// ❌ 7️⃣ Supprimer une activité
router.delete("/admin/:id", async (req, res) => {
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



module.exports = router;
