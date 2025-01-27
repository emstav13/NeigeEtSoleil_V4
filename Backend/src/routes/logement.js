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

module.exports = router;
