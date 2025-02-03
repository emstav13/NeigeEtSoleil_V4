const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../utils/dbConnection"); // Adapter selon votre fichier de connexion DB

const router = express.Router();

// Répertoire où les photos seront enregistrées
const uploadDir = path.join(__dirname, "../../Frontend/Append/assets/img/habitation");

// Vérification et création du répertoire si nécessaire
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Répertoire créé :", uploadDir);
}

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Sauvegarde les fichiers dans le bon répertoire
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname); // Nomme les fichiers de manière unique
    },
});

// Middleware Multer pour gérer le fichier
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 Mo
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Format de fichier non supporté. Seuls les fichiers JPEG, PNG et GIF sont autorisés."));
        }
    },
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

// 🏠 Ajouter un logement (Spécifique pour l'admin)
router.post("/admin", upload.single("photo"), async (req, res) => {
    const {
        idProprietaire, // Cet ID doit être fourni dans la requête
        nomImmeuble,
        adresse,
        codePostal,
        ville,
        typeLogement,
        surfaceHabitable,
        capaciteAccueil,
        specifite,
    } = req.body;

    // Vérifie si le fichier a été correctement téléchargé
    const photoPath = req.file ? `assets/img/habitation/${req.file.filename}` : null;

    const sql = `
        INSERT INTO Logement (id_proprietaire, nom_immeuble, adresse, code_postal, ville, type_logement, surface_habitable, capacite_accueil, specifite, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await db.query(sql, [
            idProprietaire,
            nomImmeuble,
            adresse,
            codePostal,
            ville,
            typeLogement,
            surfaceHabitable,
            capaciteAccueil,
            specifite,
            photoPath, // Ajout du chemin de la photo dans la base de données
        ]);
        res.status(201).json({ message: "Logement ajouté avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'insertion du logement :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du logement" });
    }
    console.log("Données reçues :", req.body);

});


// Ajouter un logement avec une photo
router.post("/", upload.single("photo"), async (req, res) => {
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

    // Vérifie si le fichier a été correctement téléchargé
    const photoPath = req.file ? `assets/img/habitation/${req.file.filename}` : null;

    const sql = `
        INSERT INTO Logement (id_proprietaire, nom_immeuble, adresse, code_postal, ville, type_logement, surface_habitable, capacite_accueil, specifite, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await db.query(sql, [
            idProprietaire,
            nomImmeuble,
            adresse,
            codePostal,
            ville,
            typeLogement,
            surfaceHabitable,
            capaciteAccueil,
            specifite,
            photoPath, // Ajout du chemin de la photo dans la base de données
        ]);
        res.status(201).json({ message: "Logement ajouté avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'insertion du logement :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du logement" });
    }

    
});

// 📝 Modifier un logement existant
router.put("/:id", async (req, res) => {

    console.log("📌 Requête PUT reçue avec ID :", req.params.id);
    console.log("📥 Données reçues :", req.body); // 🔍 Vérification ici

    const { id } = req.params;
    const {
        nom_immeuble, // 👈 Correction ici
        adresse,
        code_postal,
        ville,
        type_logement,
        surface_habitable, // 👈 Correction ici
        capacite_accueil, // 👈 Correction ici
        specifite
    } = req.body;

    const sql = `
        UPDATE logement 
        SET nom_immeuble = ?, adresse = ?, code_postal = ?, ville = ?, 
            type_logement = ?, surface_habitable = ?, capacite_accueil = ?, specifite = ?
        WHERE id_logement = ?
    `;

    try {
        const [result] = await db.query(sql, [
            nom_immeuble,
            adresse,
            code_postal,
            ville,
            type_logement,
            surface_habitable,
            capacite_accueil,
            specifite,
            id
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
    const { id } = req.params; // Récupère l'ID depuis l'URL

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
