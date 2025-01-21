package modele;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Connexion {
    private String serveur; // Adresse du serveur
    private String bdd;     // Nom de la base de données
    private String user;    // Nom d'utilisateur pour la connexion
    private String mdp;     // Mot de passe pour la connexion
    private Connection maConnexion; // Objet Connection pour interagir avec la base

    // Instance statique pour les tests de connexion
    private static Connexion uneConnexion;

    // Constructeur
    public Connexion(String serveur, String bdd, String user, String mdp) {
        this.serveur = serveur;
        this.bdd = bdd;
        this.user = user;
        this.mdp = mdp;
        this.maConnexion = null;
    }

    // Charger le pilote JDBC
    public void chargerPilote() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Pilote JDBC chargé avec succès !");
        } catch (ClassNotFoundException exp) {
            System.err.println("Erreur : Pilote JDBC non trouvé.");
        }
    }

    // Se connecter à la base de données
    public void seConnecter() {
        this.chargerPilote();
        String url = "jdbc:mysql://" + this.serveur + "/" + this.bdd + "?useSSL=false&serverTimezone=UTC";
        try {
            this.maConnexion = DriverManager.getConnection(url, this.user, this.mdp);
            System.out.println("Connexion établie avec succès à la base " + this.bdd);
        } catch (SQLException exp) {
            System.err.println("Erreur : Impossible de se connecter à la base " + this.bdd);
            exp.printStackTrace();
        }
    }

    // Fermer la connexion
    public void seDeconnecter() {
        try {
            if (this.maConnexion != null && !this.maConnexion.isClosed()) {
                this.maConnexion.close();
                System.out.println("Connexion fermée avec succès.");
            }
        } catch (SQLException exp) {
            System.err.println("Erreur : Impossible de fermer la connexion.");
            exp.printStackTrace();
        }
    }

    // Getter pour l'objet Connection
    public Connection getMaConnexion() {
        return this.maConnexion;
    }

    // Méthode pour tester la connexion à la base de données
    public static void testerConnexion() {
        // Initialisation de l'instance avec des paramètres par défaut
        uneConnexion = new Connexion("localhost:3307", "NeigeEtSoleil_V4", "root", "0000");

        // Tester la connexion
        uneConnexion.seConnecter();
        if (uneConnexion.getMaConnexion() != null) {
            System.out.println("Connexion à la base réussie !");
        } else {
            System.out.println("Échec de la connexion à la base.");
        }
        uneConnexion.seDeconnecter();
    }
}
