require("dotenv").config();
const fs = require("fs");
const path = require("path"); // ✅ Importer path AVANT de l'utiliser
if (fs.existsSync(path.join(__dirname, ".env"))) {
    console.log("📂 Fichier .env détecté !");
} else {
    console.log("❌ Fichier .env introuvable !");
}


console.log("📌 EMAIL_USER :", process.env.EMAIL_USER);
console.log("📌 EMAIL_PASS :", process.env.EMAIL_PASS ? "Mot de passe chargé" : "❌ MDP manquant !");

const express = require("express");

const cors = require("cors");

const app = express();
const PORT = 3000;



// Middleware pour parser les données JSON
app.use(express.json()); // Permet de lire les requêtes au format JSON
app.use(express.urlencoded({ extended: true })); // Permet de lire les données encodées dans un formulaire

// Middleware pour journaliser les requêtes reçues
app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.path}`);
    next();
});


// ✅ Sert les fichiers statiques depuis le bon dossier
app.use('/assets', express.static('C:/Users/nabil/workspace/NeigeEtSoleil_V4/Frontend/Append/assets'));
    



// Autoriser les requêtes provenant de n'importe quelle origine
app.use(cors({
    origin: "http://127.0.0.1:5500", // L'URL de ton front-end
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    credentials: true // Si tu as besoin d'envoyer des cookies
}));

// Import des routes
const inscriptionRoute = require("./routes/inscription"); // Corrige le chemin relatif
const loginRoute = require("./routes/login");
const logementRoute = require("./routes/logement"); // Importez la route logement
const disponibilitesRoutes = require("./routes/disponibilites");
const activitesRoutes = require("./routes/activites");
const statsRoutes = require("./routes/stats");

app.use("/NeigeEtSoleil_V4/inscription", inscriptionRoute); // Ajoute la route d'inscription
app.use("/NeigeEtSoleil_V4/login", loginRoute);
app.use("/NeigeEtSoleil_V4/logement", logementRoute); // Définir la route 
app.use("/NeigeEtSoleil_V4/disponibilites", disponibilitesRoutes);
app.use("/NeigeEtSoleil_V4/activites", activitesRoutes);
app.use("/NeigeEtSoleil_V4/stats", statsRoutes);

app.use('/NeigeEtSoleil_V4/contrats', express.static(path.join(__dirname, 'src/Contrats')));

// Gestion des erreurs pour les routes inexistantes
app.use((req, res) => {
    console.log(`Route inconnue : ${req.method} ${req.path}`);
    res.status(404).send("<h1>404 - Page Not Found</h1>"); // Réponse en cas de route inconnue
});

app.get("/test-image", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "Append", "assets", "img", "habitation", "maison_Tignes.jpg"));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
console.log("✅ Le fichier disponibilites.js est bien chargé !");
