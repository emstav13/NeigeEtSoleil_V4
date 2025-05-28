require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ✅ Vérification du fichier .env
if (fs.existsSync(path.join(__dirname, ".env"))) {
    console.log("📂 Fichier .env détecté !");
} else {
    console.log("❌ Fichier .env introuvable !");
}

// ✅ Autoriser les requêtes CORS (pour le développement uniquement)
app.use(cors({
    origin: "*", // À restreindre en production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
}));

// ✅ Middleware pour analyser les données JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Middleware pour afficher les requêtes entrantes
app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.path}`);
    next();
});

// ✅ Servir les fichiers statiques (images, scripts, CSS, etc.)
app.use('/assets', express.static(path.join(__dirname, '../../Frontend/Append/assets')));
app.use('/NeigeEtSoleil_V4/images/habitation', express.static(path.join(__dirname, '../../Frontend/Append/assets/img/habitation')));
app.use('/NeigeEtSoleil_V4/images/activite', express.static(path.join(__dirname, '../../Frontend/Append/assets/img/activite')));
app.use('/NeigeEtSoleil_V4/contrats', express.static(path.join(__dirname, '../src/Contrats')));

// ✅ Servir le frontend (index.html et autres fichiers)
app.use(express.static(path.join(__dirname, '../../Frontend/Append')));

// ✅ Route principale pour afficher la page d'accueil
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../../Frontend/Append/index.html');
    console.log("➡️ Chemin absolu du index.html:", indexPath);

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("❌ Fichier index.html introuvable !");
        res.status(500).send("Erreur : Le fichier index.html est introuvable.");
    }
});

// ✅ Importation des routes API
const inscriptionRoute = require("./routes/inscription");
const loginRoute = require("./routes/login");
const logementRoute = require("./routes/logement");
const disponibilitesRoutes = require("./routes/disponibilites");
const activitesRoutes = require("./routes/activites");
const statsRoutes = require("./routes/stats");
const imageRoutes = require("./routes/images");

// ✅ Définition des routes API
app.use("/NeigeEtSoleil_V4/inscription", inscriptionRoute);
app.use("/NeigeEtSoleil_V4/login", loginRoute);
app.use("/NeigeEtSoleil_V4/logement", logementRoute);
app.use("/NeigeEtSoleil_V4/disponibilites", disponibilitesRoutes);
app.use("/NeigeEtSoleil_V4/activites", activitesRoutes);
app.use("/NeigeEtSoleil_V4/stats", statsRoutes);
app.use("/NeigeEtSoleil_V4/images-api", imageRoutes);

// ✅ Route de test d’image (facultatif)
app.get("/test-image", (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/Append/assets/img/habitation/maison_Tignes.jpg'));
});

// ✅ Gestion des routes inconnues (erreur 404)
app.use((req, res) => {
    console.log(`Route inconnue : ${req.method} ${req.path}`);
    res.status(404).send("<h1>404 - Page non trouvée</h1>");
});

// ✅ Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

console.log("✅ Le fichier disponibilites.js est bien chargé !");
