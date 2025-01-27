const dbConnection = require("../utils/dbConnection");

// Méthode pour exécuter des requêtes SQL génériques (INSERT, UPDATE, DELETE)
const executerRequete = async (query, params = []) => {
    try {
        const [rows] = await dbConnection.execute(query, params);
        return rows;
    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête :", error);
        throw error;
    }
};

// Méthode pour vérifier les informations de connexion d'un utilisateur
const verifierUtilisateur = async (email, mot_de_passe) => {
    const query = "SELECT * FROM Utilisateur WHERE email = ? AND mot_de_passe = ?";
    try {
        const [rows] = await dbConnection.execute(query, [email, mot_de_passe]);
        return rows[0]; // Retourne l'utilisateur trouvé ou undefined
    } catch (error) {
        console.error("Erreur lors de la vérification des informations de connexion :", error);
        throw error;
    }
};

module.exports = {
    executerRequete,
    verifierUtilisateur,
};
