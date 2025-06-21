    // 📌 Importation des modules nécessaires
    const express = require("express");
    const router = express.Router();
    const db = require("../utils/dbConnection");
    const fs = require("fs");
    const path = require("path");
    const pdf = require("pdfkit"); // 📜 Module pour générer un PDF
    require("dotenv").config();
    const nodemailer = require("nodemailer"); // 📧 Module pour envoyer un email


    // 📧 Configuration du service d'envoi d'email (Nodemailer)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // ✅ Vérification de la connexion SMTP
    transporter.verify((error, success) => {
        if (error) {
            console.error("❌ Erreur de connexion SMTP :", error);
        } else {
            console.log("✅ Connexion SMTP réussie !");
        }
    });

    // 📜 **Route : Génération du contrat en PDF**
    router.get("/generer-contrat/:id_reservation", async (req, res) => {
        const { id_reservation } = req.params;
        console.log(`📜 Génération du contrat pour la réservation ID : ${id_reservation}...`);
        try {
            

            // 🔍 Récupération des infos de la réservation
            const sql = `
                SELECT r.id_reservation, u.nom, u.prenom, u.email, l.nom_immeuble, l.adresse, r.date_debut, r.date_fin
                FROM reservation r
                JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
                JOIN logement l ON r.id_logement = l.id_logement
                WHERE r.id_reservation = ?
            `;
            const [result] = await db.query(sql, [id_reservation]);

            if (result.length === 0) {
                return res.status(404).json({ error: "Réservation introuvable." });
            }

            const reservation = result[0];

            // 📌 **Création du fichier PDF**
            const pdfDoc = new pdf();
            const filePath = path.join(__dirname, `../Contrats/contrat_${id_reservation}.pdf`);

            pdfDoc.pipe(fs.createWriteStream(filePath));
            pdfDoc.fontSize(20).text("Contrat de Location", { align: "center" });
            pdfDoc.moveDown();
            pdfDoc.fontSize(14).text(`Nom : ${reservation.nom} ${reservation.prenom}`);
            pdfDoc.text(`Email : ${reservation.email}`);
            pdfDoc.text(`Logement : ${reservation.nom_immeuble}`);
            pdfDoc.text(`Adresse : ${reservation.adresse}`);
            pdfDoc.text(`Période : du ${reservation.date_debut} au ${reservation.date_fin}`);
            pdfDoc.moveDown();
            pdfDoc.text("Merci de signer et de retourner ce contrat.");
            pdfDoc.end();

            console.log("✅ Contrat généré :", filePath);
            res.download(filePath);
        } catch (error) {
            console.error("❌ Erreur lors de la génération du contrat :", error);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    });
    // 📧 **Route : Envoi du contrat par email au client**
    router.post("/envoyer-contrat/:id_reservation", async (req, res) => {
        const { id_reservation } = req.params;

        try {
            console.log(`📧 Envoi du contrat par email pour la réservation ID : ${id_reservation}...`);

            // 🔍 Récupération des infos du client et du logement
            const sql = `
                SELECT u.email, l.nom_immeuble
                FROM reservation r
                JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
                JOIN logement l ON r.id_logement = l.id_logement
                WHERE r.id_reservation = ?
            `;
            const [result] = await db.query(sql, [id_reservation]);

            if (result.length === 0) {
                return res.status(404).json({ error: "Réservation introuvable." });
            }

            const { email, nom_immeuble } = result[0];
            const filePath = path.join(__dirname, `../Contrats/contrat_${id_reservation}.pdf`);
            console.log("📂 Vérification de l'existence du fichier :", filePath);
            if (!fs.existsSync(filePath)) {
                return res.status(400).json({ error: "Contrat non généré." });
            }

            // ✉ **Préparation et envoi de l'email**
            const mailOptions = {
                from: `"Neige & Soleil" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Votre contrat de location",
                text: `Bonjour,\n\nVeuillez trouver en pièce jointe le contrat de location pour le logement : ${nom_immeuble}.\n\nMerci de le signer et de le retourner.\n\nCordialement, \nNeige & Soleil`,
                attachments: [{ filename: `contrat_${id_reservation}.pdf`, path: filePath }]
            };

            await transporter.sendMail(mailOptions);
            console.log("✅ Email envoyé à :", email);

            res.status(200).json({ message: "Contrat envoyé avec succès par email." });

        } catch (error) {
            console.error("❌ Erreur lors de l'envoi du contrat :", error);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    });
    // 🔍 **Route : Vérifier si une réservation existe déjà**
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
    // 🏡 **Route : Ajouter une nouvelle réservation**
    router.post("/reservation", async (req, res) => {
        const { id_utilisateur, id_logement, date_debut, date_fin } = req.body;

        if (!id_utilisateur || !id_logement || !date_debut || !date_fin) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        // Vérification anti-doublon
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

            // Déterminer le statut en fonction de la date
            const today = new Date().toISOString().split("T")[0];
            let statut = today > date_fin ? "disponible" : "reserve";

            // Insérer la réservation
            console.log(`📌 Ajout d'une nouvelle réservation avec statut : ${statut}`);
            const sql = `
                INSERT INTO reservation (id_utilisateur, id_logement, date_debut, date_fin, statut)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(sql, [id_utilisateur, id_logement, date_debut, date_fin, statut]);

            console.log("✅ Réservation ajoutée :", result.insertId);
            res.status(201).json({ message: "Réservation ajoutée avec succès.", reservationId: result.insertId, statut });

        } catch (error) {
            console.error("❌ Erreur lors de l'ajout de la réservation :", error);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    });
    // 📌 **Route : Récupérer les réservations d’un utilisateur**
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
    // ❌ **Route : Annuler une réservation**
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
    
// 📅 **Route : Obtenir les logements disponibles avec les infos de saison**
router.get("/disponibles", async (req, res) => {
  let {
    dateDebut,
    dateFin,
    ville,
    type_logement,
    capaciteAccueil,
    prixMin,
    prixMax,
  } = req.query;

  const datesFournies = dateDebut && dateFin;

  if (!datesFournies) {
    console.log("⚠️ Aucune date fournie — le calcul du prix total sera ignoré.");
    // On met des dates factices pour que la requête SQL fonctionne
    dateDebut = "2000-01-01";
    dateFin = "2100-12-31";
  }

  let sql = `
    SELECT 
        l.id_logement, 
        l.nom_immeuble, 
        l.adresse, 
        l.ville, 
        l.type_logement, 
        l.surface_habitable, 
        l.capacite_accueil, 
        l.specifite, 
        l.photo, 
        s.nom AS saison_nom,
        t.prix AS prix_par_nuit,
        LEAST(s.date_fin, ?) - GREATEST(s.date_debut, ?) + 1 AS jours_dans_saison
    FROM logement l
    JOIN tarif t ON l.id_logement = t.id_logement
    JOIN saison s ON t.id_saison = s.id_saison
    WHERE 
        NOT EXISTS (
            SELECT 1 FROM reservation r
            WHERE r.id_logement = l.id_logement
            AND r.statut = 'confirmé'
            AND NOT (r.date_fin < ? OR r.date_debut > ?)
        )
        AND s.date_fin >= ? 
        AND s.date_debut <= ?
  `;

  const params = [dateFin, dateDebut, dateFin, dateDebut, dateDebut, dateFin];

  // Ajout des filtres dynamiques
  if (ville) {
    sql +=
      " AND REPLACE(LOWER(TRIM(l.ville)), ' ', '') COLLATE utf8mb4_general_ci = REPLACE(LOWER(TRIM(?)), ' ', '')";
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
    sql += " AND t.prix BETWEEN ? AND ?";
    params.push(prixMin, prixMax);
  }

  sql += " ORDER BY l.id_logement, s.date_debut;";

  try {
    console.log("🔎 Paramètres reçus :", {
      dateDebut,
      dateFin,
      ville,
      type_logement,
      capaciteAccueil,
      prixMin,
      prixMax,
    });
    console.log("📌 Requête SQL générée :", sql);
    console.log("📌 Paramètres SQL envoyés :", params);

    const [rows] = await db.query(sql, params);

    // Regrouper les logements par ID
    const logementsMap = new Map();

    rows.forEach((row) => {
      if (!logementsMap.has(row.id_logement)) {
        logementsMap.set(row.id_logement, {
          id_logement: row.id_logement,
          nom_immeuble: row.nom_immeuble,
          adresse: row.adresse,
          ville: row.ville,
          type_logement: row.type_logement,
          surface_habitable: row.surface_habitable,
          capacite_accueil: row.capacite_accueil,
          specifite: row.specifite,
          photo: row.photo,
          prix_total: 0,
          saisons: [],
        });
      }

      const logement = logementsMap.get(row.id_logement);

      // ✅ On ne calcule le prix et n’ajoute la saison que si dates sont fournies
      if (datesFournies && row.jours_dans_saison > 0) {
        logement.prix_total += row.jours_dans_saison * row.prix_par_nuit;
        logement.saisons.push({
          saison: row.saison_nom,
          jours: row.jours_dans_saison,
          prix_par_nuit: row.prix_par_nuit,
        });
      }
    });

    res.status(200).json(Array.from(logementsMap.values()));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des logements :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

    // 🕒 **Route : Récupérer les réservations en attente de confirmation**
    router.get("/reservations-en-attente", async (req, res) => {
        try {
            console.log("📌 Récupération des réservations en attente de confirmation...");

            // Utilisation directe de la vue `reservations_en_attente`
            const sql = `SELECT * FROM reservations_en_attente`;
            const [rows] = await db.query(sql);

            if (rows.length === 0) {
                console.log("⚠️ Aucune réservation en attente.");
                return res.status(200).json([]); // ✅ Retourne un tableau vide avec statut 200
            }

            console.log("✅ Réservations en attente récupérées :", rows.length);
            res.status(200).json(rows);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des réservations en attente :", error);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    });
    // ✅ **Route : Validation ou refus d'une réservation par l'admin**
    router.put("/gestion-reservation/:id_reservation", async (req, res) => {
        const { id_reservation } = req.params;
        const { action } = req.body; // Valeurs acceptées : "confirmer" ou "annuler"

        // Vérifier que l'action est valide
        if (!["confirmer", "annuler"].includes(action)) {
            return res.status(400).json({ error: "Action invalide. Choisissez 'confirmer' ou 'annuler'." });
        }

        try {
            console.log(`📌 Mise à jour de la réservation ID : ${id_reservation}, action : ${action}`);

            // Déterminer le statut en fonction de l'action
            const statut = action === "confirmer" ? "confirmé" : "annulé";

            // 📌 Mise à jour du statut de la réservation
            const sql = `UPDATE reservation SET statut = ? WHERE id_reservation = ?`;
            const [result] = await db.query(sql, [statut, id_reservation]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Réservation introuvable." });
            }

            console.log(`🚀 Réservation ${statut} avec succès !`);
            res.status(200).json({ message: `Réservation ${statut} avec succès.` });

        } catch (error) {
            console.error("❌ Erreur lors de la gestion de la réservation :", error);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    });
    // 🚀 **Exportation du routeur après l'ajout de toutes les routes**
    module.exports = router;
