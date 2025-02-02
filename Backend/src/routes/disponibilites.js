const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");


// 📌 1️⃣ Vérifier si une réservation existe déjà AVANT d’en créer une
router.get("/verifier-reservation", async (req, res) => {
    const { id_utilisateur, id_logement, date_debut, date_fin } = req.query;

    if (!id_utilisateur || !id_logement || !date_debut || !date_fin) {
        return res.status(400).json({ error: "Données incomplètes." });
    }

    const sql = `
        SELECT * FROM reservation
        WHERE id_utilisateur = ? 
        AND id_logement = ? 
        AND date_debut = ? 
        AND date_fin = ? 
    `;

    try {
        console.log("🔎 Vérification de la réservation...");
        const [rows] = await db.query(sql, [id_utilisateur, id_logement, date_debut, date_fin]);

        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la vérification de la réservation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


// 📌 2️⃣ Récupérer les logements disponibles en utilisant la **Vue SQL**
router.get("/disponibles", async (req, res) => {
    const { dateDebut, dateFin, ville, type_logement, capaciteAccueil, prixMin, prixMax } = req.query;

    let sql = `
        SELECT * FROM logements_disponibles l
        WHERE NOT EXISTS (
            SELECT 1 FROM reservation r
            WHERE r.id_logement = l.id_logement
            AND r.statut = 'confirmee'
            AND NOT (r.date_fin < ? OR r.date_debut > ?)
        )
    `;

    const params = [dateDebut || "2000-01-01", dateFin || "2100-12-31"];

    if (ville) {
        sql += " AND l.ville = ?";
        params.push(ville);
    }
    if (type_logement) {
        sql += " AND l.type_logement = ?";
        params.push(type_logement);
    }
    if (capaciteAccueil) {
        sql += " AND l.capacite_accueil >= ?";
        params.push(capaciteAccueil);
    }
    if (prixMin && prixMax) {
        sql += " AND l.prix BETWEEN ? AND ?";
        params.push(prixMin, prixMax);
    }

    try {
        console.log("📌 Récupération des logements disponibles...");
        console.log("🔍 Requête SQL :", sql);
        console.log("📊 Paramètres :", params);
    
        const [rows] = await db.query(sql, params);
        console.log("✅ Logements trouvés :", rows.length);
        console.log("📡 Logements envoyés au front-end :", JSON.stringify(rows, null, 2)); // 🔍 Ajout du console.log()
    
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des logements :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
    
});


// 📌 3️⃣ Récupérer les réservations d'un utilisateur via la Vue SQL
router.get("/mes-reservations/:id_utilisateur", async (req, res) => {
    const { id_utilisateur } = req.params;

    try {
        console.log(`📌 Récupération des réservations pour l'utilisateur ${id_utilisateur}...`);
        const sql = `
            SELECT id_reservation, id_utilisateur, id_logement, logement_nom, adresse, date_debut, date_fin, statut 
            FROM reservations_utilisateur 
            WHERE id_utilisateur = ?`;

        const [rows] = await db.query(sql, [id_utilisateur]);

        if (rows.length === 0) {
            console.log("⚠️ Aucune réservation trouvée.");
            return res.status(404).json({ message: "Aucune réservation trouvée." });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des réservations :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});



// 📌 4️⃣ Ajouter une réservation avec une **vérification anti-doublon**
router.post("/reservation", async (req, res) => {
    const { id_utilisateur, id_logement, date_debut, date_fin } = req.body;

    if (!id_utilisateur || !id_logement || !date_debut || !date_fin) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    // Vérification anti-doublon avant insertion
    const checkSql = `
        SELECT * FROM reservation
        WHERE id_utilisateur = ? 
        AND id_logement = ? 
        AND date_debut = ? 
        AND date_fin = ? 
    `;

    try {
        console.log("🔎 Vérification avant insertion...");
        const [existingReservations] = await db.query(checkSql, [id_utilisateur, id_logement, date_debut, date_fin]);

        if (existingReservations.length > 0) {
            console.log("⚠️ Réservation déjà existante !");
            return res.status(409).json({ error: "Réservation déjà existante." });
        }

        // Déterminer le statut automatiquement en fonction de la date actuelle
        const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

        let statut = "reserve"; // Par défaut à "reserve"

        if (today > date_fin) {
            statut = "disponible";
        }

        // Insérer la réservation avec le statut déterminé
        console.log(`📌 Ajout d'une nouvelle réservation avec statut : ${statut}`);
        const sql = `
            INSERT INTO reservation (id_utilisateur, id_logement, date_debut, date_fin, statut)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [id_utilisateur, id_logement, date_debut, date_fin, statut]);

        console.log("✅ Réservation ajoutée :", result.insertId);
        res.status(201).json({
            message: "Réservation ajoutée avec succès.",
            reservationId: result.insertId,
            statut: statut
        });

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout de la réservation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

    // 📌 4️⃣ Annuler une réservation
router.delete("/annuler-reservation/:id_reservation", async (req, res) => {
    const { id_reservation } = req.params;

    if (!id_reservation) {
        return res.status(400).json({ error: "ID de réservation manquant." });
    }

    try {
        console.log(`📌 Tentative d'annulation de la réservation ID : ${id_reservation}...`);

        const sql = "DELETE FROM reservation WHERE id_reservation = ?";
        const [result] = await db.query(sql, [id_reservation]);

        if (result.affectedRows === 0) {
            console.log("⚠️ Aucune réservation trouvée avec cet ID.");
            return res.status(404).json({ error: "Réservation introuvable." });
        }

        console.log("✅ Réservation annulée avec succès !");
        res.status(200).json({ message: "Réservation annulée avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de l'annulation de la réservation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


module.exports = router;
