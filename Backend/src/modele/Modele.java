        package modele;

import controleur.Utilisateur;
import controleur.Logement;
import controleur.Proprietaire;
import controleur.Contrat;
import controleur.Saison;
import controleur.Tarif;
import controleur.Reservation;
import controleur.Station;
import controleur.Activite;
import controleur.Equipement;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;


public class Modele {
    // Instance unique de Connexion
    private static Connexion uneConnexion = new Connexion("localhost:3307", "NeigeEtSoleil_V4", "root", "0000");


    // Méthode générique pour exécuter une requête SQL (INSERT, UPDATE, DELETE)
    public static void executerRequete(String requete) {
        try {
            uneConnexion.seConnecter();
            uneConnexion.getMaConnexion().setAutoCommit(false); // Désactive l'auto-commit
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            unStat.execute(requete);
            uneConnexion.getMaConnexion().commit(); // Valide la transaction
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            try {
                if (uneConnexion.getMaConnexion() != null) {
                    uneConnexion.getMaConnexion().rollback(); // Annule la transaction en cas d'erreur
                }
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
    }
    

    // *********************** GESTION DES UTILISATEURS *************************

    // Méthode pour insérer un utilisateur
    public static void insertUtilisateur(Utilisateur unUtilisateur) {
        String requete = "INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, role, date_creation) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            uneConnexion.seConnecter();
            PreparedStatement preparedStatement = uneConnexion.getMaConnexion().prepareStatement(requete);
            preparedStatement.setString(1, unUtilisateur.getNom());
            preparedStatement.setString(2, unUtilisateur.getPrenom());
            preparedStatement.setString(3, unUtilisateur.getEmail());
            preparedStatement.setString(4, unUtilisateur.getMotDePasse());
            preparedStatement.setString(5, unUtilisateur.getRole());
            preparedStatement.setString(6, unUtilisateur.getDateCreation());
            preparedStatement.executeUpdate();
            preparedStatement.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur lors de l'insertion de l'utilisateur : " + exp.getMessage());
        }
    }
    
     // Méthode pour vérifier les informations de connexion d'un utilisateur
     public static Utilisateur verifierUtilisateur(String email, String mot_de_passe) {
        Utilisateur utilisateur = null;
        String requete = "SELECT * FROM Utilisateur WHERE email = ? AND mot_de_passe = ?";
    
        try {
            uneConnexion.seConnecter();
            PreparedStatement preparedStatement = uneConnexion.getMaConnexion().prepareStatement(requete);
            preparedStatement.setString(1, email);
            preparedStatement.setString(2, mot_de_passe);
    
            ResultSet resultat = preparedStatement.executeQuery();
    
            if (resultat.next()) {
                utilisateur = new Utilisateur(
                    resultat.getInt("id_utilisateur"),
                    resultat.getString("nom"),
                    resultat.getString("prenom"),
                    resultat.getString("email"),
                    resultat.getString("mot_de_passe"),
                    resultat.getString("role"),
                    resultat.getString("date_creation")
                );
            }
    
            preparedStatement.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException e) {
            System.out.println("Erreur lors de la vérification des informations de connexion : " + e.getMessage());
            e.printStackTrace();
        }
    
        return utilisateur;
    }

    // Méthode pour récupérer tous les utilisateurs
    public static ArrayList<Utilisateur> selectAllUtilisateurs() {
        ArrayList<Utilisateur> lesUtilisateurs = new ArrayList<>();
        String requete = "SELECT * FROM Utilisateur;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Utilisateur unUtilisateur = new Utilisateur(
                    lesResultats.getInt("id_utilisateur"),
                    lesResultats.getString("nom"),
                    lesResultats.getString("prenom"),
                    lesResultats.getString("email"),
                    lesResultats.getString("mot_de_passe"),
                    lesResultats.getString("role"),
                    lesResultats.getString("date_creation")
                );
                lesUtilisateurs.add(unUtilisateur);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesUtilisateurs;
    }

    // Méthode pour supprimer un utilisateur
    public static void deleteUtilisateur(int idUtilisateur) {
        String requete = "DELETE FROM Utilisateur WHERE id_utilisateur = " + idUtilisateur + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour un utilisateur
    public static void updateUtilisateur(Utilisateur unUtilisateur) {
        String requete = "UPDATE Utilisateur SET "
            + "nom = '" + unUtilisateur.getNom() + "', "
            + "prenom = '" + unUtilisateur.getPrenom() + "', "
            + "email = '" + unUtilisateur.getEmail() + "', "
            + "mot_de_passe = '" + unUtilisateur.getMotDePasse() + "', "
            + "role = '" + unUtilisateur.getRole() + "' "
            + "WHERE id_utilisateur = " + unUtilisateur.getIdUtilisateur() + ";";
        executerRequete(requete);
    }
    
    // Méthode pour verifié si l'email existe dans la table utilisateurs 
    public static boolean emailExiste(String email) {
        // Initialise la variable qui indiquera si l'email existe ou non
        boolean existe = false;

        // Requête SQL pour vérifier si un email existe déjà dans la table Utilisateur
        // La clause COUNT(*) renvoie le nombre de lignes correspondant à la condition WHERE
        String requete = "SELECT COUNT(*) AS count FROM Utilisateur WHERE email = ?";

        try {
            // Établit une connexion à la base de données
            uneConnexion.seConnecter();

            // Prépare une requête SQL pour éviter les injections SQL
            PreparedStatement preparedStatement = uneConnexion.getMaConnexion().prepareStatement(requete);

            // Associe la valeur de l'email au premier paramètre (le ? dans la requête)
            preparedStatement.setString(1, email);

            // Exécute la requête et récupère les résultats
            ResultSet resultat = preparedStatement.executeQuery();

            // Vérifie si un résultat est retourné (il y en aura toujours un à cause du COUNT)
            if (resultat.next()) {
                // Récupère le nombre d'enregistrements trouvés
                // Si COUNT(*) > 0, cela signifie que l'email existe déjà
                existe = resultat.getInt("count") > 0;
            }

            // Ferme le PreparedStatement après utilisation pour libérer les ressources
            preparedStatement.close();

            // Ferme la connexion à la base de données
            uneConnexion.seDeconnecter();
        } catch (SQLException e) {
            // Gère les exceptions en cas d'erreur SQL ou de connexion
            System.out.println("Erreur lors de la vérification de l'email : " + e.getMessage());
            e.printStackTrace();
        }

        // Retourne true si l'email existe, sinon false
        return existe;
    }
    
    

    // *********************** GESTION DES LOGEMENTS *************************

    // Méthode pour insérer un logement
public static void insertLogement(Logement unLogement) {
    String requete = "INSERT INTO Logement (id_proprietaire, nom_immeuble, adresse, code_postal, ville, type_logement, surface_habitable, capacite_accueil, specifite, photo) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    try {
        uneConnexion.seConnecter();
        PreparedStatement preparedStatement = uneConnexion.getMaConnexion().prepareStatement(requete);

        preparedStatement.setInt(1, unLogement.getIdProprietaire());
        preparedStatement.setString(2, unLogement.getNomImmeuble());
        preparedStatement.setString(3, unLogement.getAdresse());
        preparedStatement.setString(4, unLogement.getCodePostal());
        preparedStatement.setString(5, unLogement.getVille());
        preparedStatement.setString(6, unLogement.getTypeLogement());
        preparedStatement.setFloat(7, unLogement.getSurfaceHabitable());
        preparedStatement.setInt(8, unLogement.getCapaciteAccueil());
        preparedStatement.setString(9, unLogement.getSpecifite());
        preparedStatement.setString(10, unLogement.getPhoto()); // Nouveau champ

        int rowsInserted = preparedStatement.executeUpdate();
        System.out.println(rowsInserted + " ligne(s) insérée(s).");

        preparedStatement.close();
        uneConnexion.seDeconnecter();
    } catch (SQLException exp) {
        System.out.println("Erreur lors de l'insertion du logement : " + exp.getMessage());
        exp.printStackTrace();
    }
}
    
    
 // Méthode pour récupérer tous les logements
public static ArrayList<Logement> selectAllLogements() {
    ArrayList<Logement> lesLogements = new ArrayList<>();
    String requete = "SELECT * FROM Logement;";
    try {
        uneConnexion.seConnecter();
        Statement unStat = uneConnexion.getMaConnexion().createStatement();
        ResultSet lesResultats = unStat.executeQuery(requete);
        while (lesResultats.next()) {
            Logement unLogement = new Logement(
                lesResultats.getInt("id_logement"),
                lesResultats.getInt("id_proprietaire"),
                lesResultats.getString("nom_immeuble"),
                lesResultats.getString("adresse"),
                lesResultats.getString("code_postal"),
                lesResultats.getString("ville"),
                lesResultats.getString("type_logement"),
                lesResultats.getFloat("surface_habitable"),
                lesResultats.getInt("capacite_accueil"),
                lesResultats.getString("specifite"),
                lesResultats.getString("photo") // Nouveau champ
            );
            lesLogements.add(unLogement);
        }
        unStat.close();
        uneConnexion.seDeconnecter();
    } catch (SQLException exp) {
        System.out.println("Erreur d'exécution de la requête : " + requete);
        exp.printStackTrace();
    }
    return lesLogements;
}


    // Méthode pour supprimer un logement
    public static void deleteLogement(int idLogement) {
        String requete = "DELETE FROM Logement WHERE id_logement = " + idLogement + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour un logement
public static void updateLogement(Logement unLogement) {
    String requete = "UPDATE Logement SET "
        + "nom_immeuble = '" + unLogement.getNomImmeuble() + "', "
        + "adresse = '" + unLogement.getAdresse() + "', "
        + "code_postal = '" + unLogement.getCodePostal() + "', "
        + "ville = '" + unLogement.getVille() + "', "
        + "type_logement = '" + unLogement.getTypeLogement() + "', "
        + "surface_habitable = " + unLogement.getSurfaceHabitable() + ", "
        + "capacite_accueil = " + unLogement.getCapaciteAccueil() + ", "
        + "specifite = '" + unLogement.getSpecifite() + "', "
        + "photo = '" + unLogement.getPhoto() + "' " // Nouveau champ
        + "WHERE id_logement = " + unLogement.getIdLogement() + ";";
    executerRequete(requete);
}
    // *********************** GESTION DES PROPRIETAIRES *************************

    // Méthode pour insérer un propriétaire
    public static void insertProprietaire(Proprietaire unProprietaire) {
        String requete = "INSERT INTO Proprietaire VALUES (null, "
            + unProprietaire.getIdUtilisateur() + ");";
        executerRequete(requete);
    }

    // Méthode pour récupérer tous les propriétaires
    public static ArrayList<Proprietaire> selectAllProprietaires() {
        ArrayList<Proprietaire> lesProprietaires = new ArrayList<>();
        String requete = "SELECT * FROM Proprietaire;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Proprietaire unProprietaire = new Proprietaire(
                    lesResultats.getInt("id_proprietaire"),
                    lesResultats.getInt("id_utilisateur")
                );
                lesProprietaires.add(unProprietaire);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesProprietaires;
    }

    // Méthode pour supprimer un propriétaire
    public static void deleteProprietaire(int idProprietaire) {
        String requete = "DELETE FROM Proprietaire WHERE id_proprietaire = " + idProprietaire + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour un propriétaire
    public static void updateProprietaire(Proprietaire unProprietaire) {
        String requete = "UPDATE Proprietaire SET "
            + "id_utilisateur = " + unProprietaire.getIdUtilisateur() + " "
            + "WHERE id_proprietaire = " + unProprietaire.getIdProprietaire() + ";";
        executerRequete(requete);
    }
    	
    // *********************** GESTION DES CONTRATS *************************

    // Méthode pour insérer un contrat
    public static void insertContrat(Contrat unContrat) {
        String requete = "INSERT INTO Contrat VALUES (null, "
            + unContrat.getIdProprietaire() + ", "
            + unContrat.getIdLogement() + ", '"
            + unContrat.getDateDebut() + "', '"
            + unContrat.getDateFin() + "', '"
            + unContrat.getStatut() + "');";
        executerRequete(requete);
    }

    // Méthode pour récupérer tous les contrats
    public static ArrayList<Contrat> selectAllContrats() {
        ArrayList<Contrat> lesContrats = new ArrayList<>();
        String requete = "SELECT * FROM Contrat;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Contrat unContrat = new Contrat(
                    lesResultats.getInt("id_contrat"),
                    lesResultats.getInt("id_proprietaire"),
                    lesResultats.getInt("id_logement"),
                    lesResultats.getString("date_debut"),
                    lesResultats.getString("date_fin"),
                    lesResultats.getString("statut")
                );
                lesContrats.add(unContrat);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesContrats;
    }

    // Méthode pour supprimer un contrat
    public static void deleteContrat(int idContrat) {
        String requete = "DELETE FROM Contrat WHERE id_contrat = " + idContrat + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour un contrat
    public static void updateContrat(Contrat unContrat) {
        String requete = "UPDATE Contrat SET "
            + "id_proprietaire = " + unContrat.getIdProprietaire() + ", "
            + "id_logement = " + unContrat.getIdLogement() + ", "
            + "date_debut = '" + unContrat.getDateDebut() + "', "
            + "date_fin = '" + unContrat.getDateFin() + "', "
            + "statut = '" + unContrat.getStatut() + "' "
            + "WHERE id_contrat = " + unContrat.getIdContrat() + ";";
        executerRequete(requete);
    }
    // *********************** GESTION DES SAISONS *************************

    // Méthode pour insérer une saison
    public static void insertSaison(Saison uneSaison) {
        String requete = "INSERT INTO Saison VALUES (null, '"
            + uneSaison.getNom() + "', '"
            + uneSaison.getDateDebut() + "', '"
            + uneSaison.getDateFin() + "');";
        executerRequete(requete);
    }

    // Méthode pour récupérer toutes les saisons
    public static ArrayList<Saison> selectAllSaisons() {
        ArrayList<Saison> lesSaisons = new ArrayList<>();
        String requete = "SELECT * FROM Saison;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Saison uneSaison = new Saison(
                    lesResultats.getInt("id_saison"),
                    lesResultats.getString("nom"),
                    lesResultats.getString("date_debut"),
                    lesResultats.getString("date_fin")
                );
                lesSaisons.add(uneSaison);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesSaisons;
    }

    // Méthode pour supprimer une saison
    public static void deleteSaison(int idSaison) {
        String requete = "DELETE FROM Saison WHERE id_saison = " + idSaison + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour une saison
    public static void updateSaison(Saison uneSaison) {
        String requete = "UPDATE Saison SET "
            + "nom = '" + uneSaison.getNom() + "', "
            + "date_debut = '" + uneSaison.getDateDebut() + "', "
            + "date_fin = '" + uneSaison.getDateFin() + "' "
            + "WHERE id_saison = " + uneSaison.getIdSaison() + ";";
        executerRequete(requete);
    }
    
    // *********************** GESTION DES TARIFS *************************

    // Méthode pour insérer un tarif
    public static void insertTarif(Tarif unTarif) {
        String requete = "INSERT INTO Tarif VALUES (null, "
            + unTarif.getIdLogement() + ", "
            + unTarif.getIdSaison() + ", "
            + unTarif.getPrix() + ");";
        executerRequete(requete);
    }

    // Méthode pour récupérer tous les tarifs
    public static ArrayList<Tarif> selectAllTarifs() {
        ArrayList<Tarif> lesTarifs = new ArrayList<>();
        String requete = "SELECT * FROM Tarif;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Tarif unTarif = new Tarif(
                    lesResultats.getInt("id_tarif"),
                    lesResultats.getInt("id_logement"),
                    lesResultats.getInt("id_saison"),
                    lesResultats.getDouble("prix")
                );
                lesTarifs.add(unTarif);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesTarifs;
    }

    // Méthode pour supprimer un tarif
    public static void deleteTarif(int idTarif) {
        String requete = "DELETE FROM Tarif WHERE id_tarif = " + idTarif + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour un tarif
    public static void updateTarif(Tarif unTarif) {
        String requete = "UPDATE Tarif SET "
            + "id_logement = " + unTarif.getIdLogement() + ", "
            + "id_saison = " + unTarif.getIdSaison() + ", "
            + "prix = " + unTarif.getPrix() + " "
            + "WHERE id_tarif = " + unTarif.getIdTarif() + ";";
        executerRequete(requete);
    }
    
    // *********************** GESTION DES RÉSERVATIONS *************************

    // Méthode pour insérer une réservation
    public static void insertReservation(Reservation uneReservation) {
        String requete = "INSERT INTO Reservation VALUES (null, "
            + uneReservation.getIdUtilisateur() + ", "
            + uneReservation.getIdLogement() + ", '"
            + uneReservation.getDateDebut() + "', '"
            + uneReservation.getDateFin() + "', '"
            + uneReservation.getStatut() + "');";
        executerRequete(requete);
    }

    // Méthode pour récupérer toutes les réservations
    public static ArrayList<Reservation> selectAllReservations() {
        ArrayList<Reservation> lesReservations = new ArrayList<>();
        String requete = "SELECT * FROM Reservation;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Reservation uneReservation = new Reservation(
                    lesResultats.getInt("id_reservation"),
                    lesResultats.getInt("id_utilisateur"),
                    lesResultats.getInt("id_logement"),
                    lesResultats.getString("date_debut"),
                    lesResultats.getString("date_fin"),
                    lesResultats.getString("statut")
                );
                lesReservations.add(uneReservation);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesReservations;
    }

    // Méthode pour supprimer une réservation
    public static void deleteReservation(int idReservation) {
        String requete = "DELETE FROM Reservation WHERE id_reservation = " + idReservation + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour une réservation
    public static void updateReservation(Reservation uneReservation) {
        String requete = "UPDATE Reservation SET "
            + "id_utilisateur = " + uneReservation.getIdUtilisateur() + ", "
            + "id_logement = " + uneReservation.getIdLogement() + ", "
            + "date_debut = '" + uneReservation.getDateDebut() + "', "
            + "date_fin = '" + uneReservation.getDateFin() + "', "
            + "statut = '" + uneReservation.getStatut() + "' "
            + "WHERE id_reservation = " + uneReservation.getIdReservation() + ";";
        executerRequete(requete);
    }

    
    // *********************** GESTION DES STATIONS *************************

    // Méthode pour insérer une station
    public static void insertStation(Station uneStation) {
        String requete = "INSERT INTO Station VALUES (null, '"
            + uneStation.getNom() + "');";
        executerRequete(requete);
    }

    // Méthode pour récupérer toutes les stations
    public static ArrayList<Station> selectAllStations() {
        ArrayList<Station> lesStations = new ArrayList<>();
        String requete = "SELECT * FROM Station;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Station uneStation = new Station(
                    lesResultats.getInt("id_station"),
                    lesResultats.getString("nom")
                );
                lesStations.add(uneStation);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesStations;
    }

    // Méthode pour supprimer une station
    public static void deleteStation(int idStation) {
        String requete = "DELETE FROM Station WHERE id_station = " + idStation + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour une station
    public static void updateStation(Station uneStation) {
        String requete = "UPDATE Station SET "
            + "nom = '" + uneStation.getNom() + "' "
            + "WHERE id_station = " + uneStation.getIdStation() + ";";
        executerRequete(requete);
    }

    	
    // *********************** GESTION DES ACTIVITÉS *************************

    // Méthode pour insérer une activité
    public static void insertActivite(Activite uneActivite) {
        String requete = "INSERT INTO Activite VALUES (null, '"
            + uneActivite.getNomActivite() + "', "
            + uneActivite.getIdStation() + ");";
        executerRequete(requete);
    }

    // Méthode pour récupérer toutes les activités
    public static ArrayList<Activite> selectAllActivites() {
        ArrayList<Activite> lesActivites = new ArrayList<>();
        String requete = "SELECT * FROM Activite;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Activite uneActivite = new Activite(
                    lesResultats.getInt("id_activite"),
                    lesResultats.getString("nom_activite"),
                    lesResultats.getInt("id_station")
                );
                lesActivites.add(uneActivite);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesActivites;
    }

    // Méthode pour supprimer une activité
    public static void deleteActivite(int idActivite) {
        String requete = "DELETE FROM Activite WHERE id_activite = " + idActivite + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour une activité
    public static void updateActivite(Activite uneActivite) {
        String requete = "UPDATE Activite SET "
            + "nom_activite = '" + uneActivite.getNomActivite() + "', "
            + "id_station = " + uneActivite.getIdStation() + " "
            + "WHERE id_activite = " + uneActivite.getIdActivite() + ";";
        executerRequete(requete);
    }

    // *********************** GESTION DES ÉQUIPEMENTS *************************

    // Méthode pour insérer un équipement
    public static void insertEquipement(Equipement unEquipement) {
        String requete = "INSERT INTO Equipement VALUES (null, '"
            + unEquipement.getNomEquipement() + "', '"
            + unEquipement.getDescription() + "', "
            + unEquipement.getIdActivite() + ");";
        executerRequete(requete);
    }

    // Méthode pour récupérer tous les équipements
    public static ArrayList<Equipement> selectAllEquipements() {
        ArrayList<Equipement> lesEquipements = new ArrayList<>();
        String requete = "SELECT * FROM Equipement;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Equipement unEquipement = new Equipement(
                    lesResultats.getInt("id_equipement"),
                    lesResultats.getString("nom_equipement"),
                    lesResultats.getString("description"),
                    lesResultats.getInt("id_activite")
                );
                lesEquipements.add(unEquipement);
            }
            unStat.close();
            uneConnexion.seDeconnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return lesEquipements;
    }

    // Méthode pour supprimer un équipement
    public static void deleteEquipement(int idEquipement) {
        String requete = "DELETE FROM Equipement WHERE id_equipement = " + idEquipement + ";";
        executerRequete(requete);
    }

    // Méthode pour mettre à jour un équipement
    public static void updateEquipement(Equipement unEquipement) {
        String requete = "UPDATE Equipement SET "
            + "nom_equipement = '" + unEquipement.getNomEquipement() + "', "
            + "description = '" + unEquipement.getDescription() + "', "
            + "id_activite = " + unEquipement.getIdActivite() + " "
            + "WHERE id_equipement = " + unEquipement.getIdEquipement() + ";";
        executerRequete(requete);
    }

}
