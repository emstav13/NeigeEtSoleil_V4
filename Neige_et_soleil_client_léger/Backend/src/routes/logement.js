const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../utils/dbConnection"); // Adapter selon votre fichier de connexion DB

const router = express.Router();

// Répertoire où les photos seront enregistrées
const uploadDir = path.resolve(__dirname, "../../../Frontend/Append/assets/img/habitation");


console.log("Chemin final vérifié :", uploadDir);


// Vérification et création du répertoire si nécessaire
if (!fs.existsSync(uploadDir)) {
    console.error("❌ Dossier cible introuvable :", uploadDir);
    console.error("Veuillez vérifier le chemin absolu.");
    process.exit(1); // Stoppe immédiatement le serveur
}


// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Répertoire pour sauvegarder les fichiers
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nomme les fichiers de manière unique
    }
});

// Middleware Multer pour gérer les fichiers
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille : 5 Mo
});
// 🏠 Récupérer tous les logements pour l'admin
router.get("/admin", async (req, res) => {
    console.log("🔹 Route /admin/logements atteinte !");
    try {
        const sql = `
            SELECT l.id_logement, l.nom_immeuble, l.adresse, l.code_postal, l.ville, 
                   l.type_logement, l.surface_habitable, l.capacite_accueil, 
                   l.specifite, l.photo, 
                   u.nom AS proprietaire_nom, u.prenom AS proprietaire_prenom
            FROM logement l
            JOIN utilisateur u ON l.id_proprietaire = u.id_utilisateur
            WHERE u.role = 'proprietaire'
        `;
        
        const [rows] = await db.query(sql);
        console.log("📥 Résultat SQL :", rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des logements :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🏠 Récupérer les logements d'un propriétaire spécifique
router.get("/mes-logements/:id_proprietaire", async (req, res) => {
    const { id_proprietaire } = req.params;

    console.log(`📌 Récupération des logements du propriétaire ID: ${id_proprietaire}...`);

    try {
        const sql = `
            SELECT id_logement, nom_immeuble, adresse, code_postal, ville, 
                   type_logement, surface_habitable, capacite_accueil, 
                   specifite, photo
            FROM logement
            WHERE id_proprietaire = ?
        `;

        const [rows] = await db.query(sql, [id_proprietaire]);

        if (rows.length === 0) {
            console.log("⚠️ Aucun logement trouvé pour ce propriétaire.");
            return res.status(404).json({ message: "Aucun logement trouvé." });
        }

        console.log("✅ Logements récupérés :", rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des logements :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🏠 Récupérer la liste des propriétaires
router.get("/proprietaires", async (req, res) => {
    try {
        const sql = `SELECT id_utilisateur, nom, prenom FROM utilisateur WHERE role = 'proprietaire'`;
        const [rows] = await db.query(sql);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Aucun propriétaire trouvé" });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des propriétaires :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});
// 🏠 Récupérer un logement spécifique par son ID
router.get("/:id", async (req, res) => {
    const logementId = req.params.id;
    console.log(`📌 Requête GET reçue pour le logement ID: ${logementId}`);

    try {
        const sql = `
            SELECT l.id_logement, l.nom_immeuble, l.adresse, l.code_postal, l.ville, 
                   l.type_logement, l.surface_habitable, l.capacite_accueil, 
                   l.specifite, l.photo, 
                   u.nom AS proprietaire_nom, u.prenom AS proprietaire_prenom
            FROM logement l
            JOIN utilisateur u ON l.id_proprietaire = u.id_utilisateur
            WHERE l.id_logement = ?
        `;
        
        const [rows] = await db.query(sql, [logementId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Logement non trouvé" });
        }

        res.status(200).json(rows[0]); // Retourne l'objet logement
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du logement :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🏠 Ajouter un logement avec une photo
router.post("/", upload.single("photo"), async (req, res) => {
    try {
        console.log("📝 Données reçues :", req.body);
        console.log("📸 Fichier reçu (req.file):", req.file);
        console.log("📸 Fichiers reçus (req.files):", req.files);
        const {
            idProprietaire,
            nomImmeuble,
            adresse,
            codePostal,
            ville,
            typeLogement,
            surfaceHabitable,
            capaciteAccueil,
            specifite,
        } = req.body;

        const photoPath = req.file ? `assets/img/habitation/${req.file.filename}` : null;

        const sql = `
            INSERT INTO Logement (id_proprietaire, nom_immeuble, adresse, code_postal, ville, type_logement, surface_habitable, capacite_accueil, specifite, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            idProprietaire,
            nomImmeuble,
            adresse,
            codePostal,
            ville,
            typeLogement,
            surfaceHabitable,
            capaciteAccueil,
            specifite || null,
            photoPath,
        ]);

        console.log("📥 Logement inséré avec succès :", result.insertId);
        res.status(201).json({ message: "Logement ajouté avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du logement :", error);
        res.status(500).json({ error: "Erreur interne lors de l'ajout du logement." });
    }
});
// 📝 Modifier un logement existant
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nomImmeuble,
        adresse,
        codePostal,
        ville,
        typeLogement,
        surfaceHabitable,
        capaciteAccueil,
        specifite,
    } = req.body;

    if (!nomImmeuble || !adresse || !codePostal || !ville || !typeLogement || !surfaceHabitable || !capaciteAccueil) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }

    const sql = `
        UPDATE logement 
        SET nom_immeuble = ?, adresse = ?, code_postal = ?, ville = ?, 
            type_logement = ?, surface_habitable = ?, capacite_accueil = ?, specifite = ?
        WHERE id_logement = ?
    `;

    try {
        const [result] = await db.query(sql, [
            nomImmeuble,
            adresse,
            codePostal,
            ville,
            typeLogement,
            surfaceHabitable,
            capaciteAccueil,
            specifite || null,
            id,
        ]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "✅ Logement mis à jour avec succès !" });
        } else {
            res.status(404).json({ error: "❌ Logement non trouvé." });
        }
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du logement :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ❌ Supprimer un logement par ID
router.delete("/admin/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "DELETE FROM logement WHERE id_logement = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "✅ Logement supprimé avec succès !" });
        } else {
            res.status(404).json({ error: "❌ Logement non trouvé." });
        }
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du logement :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});
module.exports = router;
