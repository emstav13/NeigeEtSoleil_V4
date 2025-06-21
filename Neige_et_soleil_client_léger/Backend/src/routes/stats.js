
const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");
const pool = require('../utils/dbConnection');


// 📊 **Route : Statistiques sur les activités réservées par type**
router.get("/activites-par-type", async (req, res) => {
    try {
        const sql = `SELECT * FROM activites_reservees_par_type`;
        const [rows] = await db.query(sql);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 📊 Route : Statistiques sur les réservations par type de logement
router.get("/reservations-par-type-logement", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM reservations_par_type_logement");
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques sur les types de logements :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// 📊 Route : Statistiques des activités les plus populaires
router.get("/activites-populaires", async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT nom_activite, type_activite, nombre_reservations, revenu_total
            FROM activites_reservees_par_type
            ORDER BY nombre_reservations DESC
            LIMIT 5
        `);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques sur les activités populaires :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// 📊 Route : Statistiques mensuelles des réservations
router.get("/reservations-par-mois", async (req, res) => {
    try {
        const [result] = await db.query(`
                    SELECT 
            MONTHNAME(r.date_debut) AS mois,
            YEAR(r.date_debut) AS annee,
            COUNT(r.id_reservation) AS nombre_reservations
        FROM reservation r
        GROUP BY annee, mois
        ORDER BY annee, mois;
        `);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques mensuelles :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// 📊 Route : Statistiques globales
router.get("/globales", async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT
  (SELECT COUNT(*) FROM reservation) AS total_reservations_logement,
  (SELECT COUNT(*) FROM logement) AS total_logements,
  (SELECT COUNT(*) FROM reservation_activite) AS total_reservations_activite,
  (
    (SELECT SUM(montant) FROM suivi_revenus) + 
    (SELECT SUM(prix_total) FROM reservation_activite)
  ) AS revenu_total
    `);

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques globales :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


// 📊 Route : Meilleur client
router.get('/top-clients/:nb_clients', async (req, res) => {
    const nb_clients = req.params.nb_clients;
  
    try {
      const [results] = await pool.query(`CALL topClients(?)`, [nb_clients]);
      res.json(results[0]);  // Retourne les résultats de la procédure
    } catch (error) {
      console.error("Erreur lors de la récupération des top clients :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
  
  // 📊 Afficher les détails des réservations d’un utilisateur spécifique
  router.get('/reservations-utilisateur/:id', async (req, res) => {
    const id_utilisateur = req.params.id;
  
    try {
      const [results] = await pool.query(`CALL detailsReservationsUtilisateur(?)`, [id_utilisateur]);
      res.json(results[0]);  // Retourne les détails des réservations
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
  
  // 📊 Trigger Pour Montrer les changements récents ou fournir un historique des mises à jour
  router.get('/suivi-revenus', async (req, res) => {
    try {
      const [results] = await pool.query(`
        SELECT id_reservation, montant, date_revenu 
        FROM suivi_revenus 
        ORDER BY date_revenu DESC
      `);
      res.json(results);
    } catch (error) {
      console.error("Erreur lors de la récupération du suivi des revenus :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
  

  // 📊 Calculer le revenu total généré par un client spécifique
router.get('/revenu-client/:id', async (req, res) => {
    const id_client = req.params.id;

    try {
        const [results] = await pool.query(`CALL calculerRevenuParClient(?)`, [id_client]);
        res.status(200).json(results[0]);  // Retourne les résultats de la procédure
    } catch (error) {
        console.error("Erreur lors de la récupération du revenu du client :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// 📊 Historique des changements de statut des réservations
router.get('/historique-reservations', async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT id_reservation, ancien_statut, nouveau_statut, date_modification 
            FROM historique_reservation 
            ORDER BY date_modification DESC
        `);
        res.status(200).json(results);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des réservations :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

//📊 Calculer les revenus par station sur une période donnée 
  router.post('/revenus-par-station', async (req, res) => {
    const { date_debut, date_fin } = req.body;
  
    try {
      const [results] = await pool.query(`CALL calculerRevenusParStation(?, ?)`, [date_debut, date_fin]);
      res.json(results[0]);  // Retourne les résultats de la procédure
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus par station :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });

// 🚀 **Exportation du routeur**
module.exports = router;
