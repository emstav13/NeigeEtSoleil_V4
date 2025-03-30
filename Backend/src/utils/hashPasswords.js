const bcrypt = require("bcrypt");
const db = require("./dbConnection"); // ⚠️ Chemin relatif vers ta connexion DB

async function hashPasswords() {
  try {
    const [rows] = await db.execute("SELECT id_utilisateur, mot_de_passe FROM Utilisateur");

    for (let user of rows) {
      if (!user.mot_de_passe.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(user.mot_de_passe, 10);
        await db.execute("UPDATE Utilisateur SET mot_de_passe = ? WHERE id_utilisateur = ?", [hashed, user.id_utilisateur]);
        console.log(`✅ Mot de passe hashé pour utilisateur ID ${user.id_utilisateur}`);
      } else {
        console.log(`⏭️ Déjà hashé : utilisateur ID ${user.id_utilisateur}`);
      }
    }

    console.log("🎉 Tous les mots de passe en clair ont été convertis !");
    process.exit(0); // pour terminer proprement
  } catch (error) {
    console.error("❌ Erreur pendant le hashage :", error);
    process.exit(1);
  }
}

hashPasswords();
