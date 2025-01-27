const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");

// Route pour récupérer les logements disponibles
router.get("/disponibles", async (req, res) => {
    const {
        dateDebut,
        dateFin,
        type_logement,
        capaciteAccueil,
        ville,
        prixMin,
        prixMax,
    } = req.query;

    let sql = `
        SELECT
            l.id_logement, l.nom_immeuble, l.adresse, l.ville, l.type_logement,
            l.surface_habitable, l.capacite_accueil, l.specifite, l.photo,
            t.prix, s.nom AS saison_nom
        FROM
            logement l
        LEFT JOIN
            reservation r ON l.id_logement = r.id_logement
            AND r.statut = 'confirmee'
            AND NOT (
                r.date_fin < ? OR r.date_debut > ?
            )
        INNER JOIN
            tarif t ON l.id_logement = t.id_logement
        INNER JOIN
            saison s ON t.id_saison = s.id_saison
        WHERE
            r.id_reservation IS NULL
    `;

    const params = [dateDebut || null, dateFin || null];

    if (ville) {
        sql += " AND l.ville = ?";
        params.push(ville);
        console.log("Ville :", ville);
    }
    if (type_logement) {
        sql += " AND l.type_logement = ?";
        params.push(type_logement);
    }
    if (prixMin && prixMax) {
        sql += " AND t.prix BETWEEN ? AND ?";
        params.push(prixMin, prixMax);
    }
    if (capaciteAccueil) {
        sql += " AND l.capacite_accueil >= ?";
        params.push(capaciteAccueil);
    }

    try {
        console.log("Requête SQL générée :", sql);
        console.log("Paramètres :", params);

        const [rows] = await db.query(sql, params);

        console.log("Résultats :", rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des logements disponibles :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


module.exports = router;
