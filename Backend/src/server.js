require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ✅ .env check
if (fs.existsSync(path.join(__dirname, ".env"))) {
  console.log("📂 Fichier .env détecté !");
} else {
  console.log("❌ Fichier .env introuvable !");
}

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.path}`);
  next();
});

// ✅ CORS config
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Définition des chemins
const frontendPath = path.resolve(__dirname, "../../Frontend/Append");
const assetsPath = path.join(frontendPath, "assets");

// ✅ Fichiers statiques
app.use("/assets", express.static(assetsPath));
app.use(
  "/NeigeEtSoleil_V4/images/habitation",
  express.static(path.join(assetsPath, "img", "habitation"))
);
app.use(
  "/NeigeEtSoleil_V4/images/activite",
  express.static(path.join(assetsPath, "img", "activite"))
);
app.use(
  "/NeigeEtSoleil_V4/contrats",
  express.static(path.join(__dirname, "Contrats"))
);

// ✅ Affichage de la page index.html
app.get("/", (req, res) => {
  const indexPath = path.join(frontendPath, "index.html");
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("❌ index.html introuvable !");
      res.status(500).send("Fichier index.html introuvable !");
    } else {
      res.sendFile(indexPath);
    }
  });
});

// ✅ Routes API
const inscriptionRoute = require("./routes/inscription");
const loginRoute = require("./routes/login");
const logementRoute = require("./routes/logement");
const disponibilitesRoutes = require("./routes/disponibilites");
const activitesRoutes = require("./routes/activites");
const statsRoutes = require("./routes/stats");
const imageRoutes = require("./routes/images");

app.use("/NeigeEtSoleil_V4/inscription", inscriptionRoute);
app.use("/NeigeEtSoleil_V4/login", loginRoute);
app.use("/NeigeEtSoleil_V4/logement", logementRoute);
app.use("/NeigeEtSoleil_V4/disponibilites", disponibilitesRoutes);
app.use("/NeigeEtSoleil_V4/activites", activitesRoutes);
app.use("/NeigeEtSoleil_V4/stats", statsRoutes);
app.use("/NeigeEtSoleil_V4/images-api", imageRoutes);

// ❌ Gestion des routes inconnues
app.use((req, res) => {
  console.log(`Route inconnue : ${req.method} ${req.path}`);
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

// ✅ Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
