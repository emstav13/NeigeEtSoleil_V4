const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");
const fs = require("fs");
const path = require("path");
const pdf = require("pdfkit"); // 📌 Module pour générer un PDF
const nodemailer = require("nodemailer"); // 📌 Module pour envoyer un email

// 🚀📜 1️⃣ **Génération du contrat en PDF**
router.get("/generer-contrat/:id_reservation", async (req, res) => {
    const { id_reservation } = req.params;

    try {
        console.log(`📜 Génération du contrat pour la réservation ID : ${id_reservation}...`);

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
        const filePath = path.join(__dirname, `../../Contrats/contrat_${id_reservation}.pdf`);

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

// 📌  Vérifier si une réservation existe déjà AVANT d’en créer une
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


// 🚀✅ 2️⃣ **Validation de la réservation par l'admin**
router.put("/valider-reservation/:id_reservation", async (req, res) => {
    const { id_reservation } = req.params;

    try {
        console.log(`✅ Validation de la réservation ID : ${id_reservation}...`);

        // 📌 Mise à jour du statut de la réservation à "confirmée"
        const sql = `UPDATE reservation SET statut = 'reserve' WHERE id_reservation = ?`;
        const [result] = await db.query(sql, [id_reservation]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Réservation introuvable." });
        }

        console.log("🚀 Réservation validée !");
        res.status(200).json({ message: "Réservation validée avec succès." });

    } catch (error) {
        console.error("❌ Erreur lors de la validation de la réservation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🚀📧 3️⃣ **Envoi du contrat par email au client**
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
        const filePath = path.join(__dirname, `../../Contrats/contrat_${id_reservation}.pdf`);

        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ error: "Contrat non généré." });
        }

        // 📌 **Configuration du service d'envoi d'email**
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ton_email@gmail.com", // Remplace par ton adresse email
                pass: "ton_mot_de_passe" // Remplace par ton mot de passe
            }
        });

        const mailOptions = {
            from: "ton_email@gmail.com",
            to: email,
            subject: "Votre contrat de location",
            text: `Bonjour,\n\nVeuillez trouver en pièce jointe le contrat de location pour le logement : ${nom_immeuble}.\n\nMerci de le signer et de le retourner.\n\nCordialement, \nNeige & Soleil`,
            attachments: [
                {
                    filename: `contrat_${id_reservation}.pdf`,
                    path: filePath
                }
            ]
        };

        // ✉ **Envoi de l'email**
        await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé à :", email);

        res.status(200).json({ message: "Contrat envoyé avec succès par email." });

    } catch (error) {
        console.error("❌ Erreur lors de l'envoi du contrat :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});


// 📌  Ajouter une réservation avec une **vérification anti-doublon**
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
