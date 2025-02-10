const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


// Correcte les chemins pour correspondre à la structure réelle
const habitationDir = path.join(__dirname, "../../../Frontend/Append/assets/img/habitation");
const activiteDir = path.join(__dirname, "../../../Frontend/Append/assets/img/activite");


// Fonction pour lister les fichiers dans un répertoire
function listFiles(directory) {
    try {
      return fs.readdirSync(directory)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map(file => path.basename(file)); // Garde uniquement le nom du fichier
    } catch (error) {
      console.error(`Erreur lors de la lecture du répertoire ${directory} :`, error);
      return [];
    }
  }
  

// Route pour récupérer les listes d'images
router.get("/", (req, res) => {
    const habitationImages = listFiles(habitationDir);
    const activiteImages = listFiles(activiteDir);
  
    console.log("🔍 Images récupérées :", { habitationImages, activiteImages });
  
    res.json({
      habitation: habitationImages,
      activite: activiteImages,
    });
  });
  
  

module.exports = router;
