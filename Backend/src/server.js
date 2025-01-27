const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware pour parser les données JSON
app.use(express.json()); // Permet de lire les requêtes au format JSON
app.use(express.urlencoded({ extended: true })); // Permet de lire les données encodées dans un formulaire

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

app.use("/NeigeEtSoleil_V4/inscription", inscriptionRoute); // Ajoute la route d'inscription
app.use("/NeigeEtSoleil_V4/login", loginRoute);
app.use("/NeigeEtSoleil_V4/logement", logementRoute); // Définir la route 
app.use("/NeigeEtSoleil_V4/disponibilites", disponibilitesRoutes);
// Middleware pour journaliser les requêtes reçues
app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.path}`);
    next();
});

// Servir les fichiers statiques (Front-end)
app.use(express.static(path.join(__dirname, "Frontend/Append"))); // Vérifie que ce chemin est correct

// Gestion des erreurs pour les routes inexistantes
app.use((req, res) => {
    console.log(`Route inconnue : ${req.method} ${req.path}`);
    res.status(404).send("<h1>404 - Page Not Found</h1>"); // Réponse en cas de route inconnue
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
