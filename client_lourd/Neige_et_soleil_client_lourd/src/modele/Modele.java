package modele;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.mindrot.jbcrypt.BCrypt;

import controleur.Logement;
import controleur.Proprietaire;
import controleur.Reservation;
import controleur.Utilisateur;

public class Modele {
    private static Connexion uneConnexion = new Connexion("localhost:3310", "neigeetsoleil_v4", "root", "123abc");

    public static Connexion getConnexion() { 
        return uneConnexion;
    }


    /************************ GESTION DES UTILISATEURS **********************/

    public static void insertUtilisateur(Utilisateur unUtilisateur) {
        String motDePasseHash = org.mindrot.jbcrypt.BCrypt.hashpw(unUtilisateur.getMotDePasse(), org.mindrot.jbcrypt.BCrypt.gensalt());
        String requete = "INSERT INTO utilisateur VALUES (null, '" + unUtilisateur.getNom()
                + "','" + unUtilisateur.getPrenom() + "','" + unUtilisateur.getEmail()
                + "','" + motDePasseHash + "','" + unUtilisateur.getRole()
                + "', NOW());";
        executerRequete(requete);
    }


    public static ArrayList<Utilisateur> selectAllUtilisateurs() {
        ArrayList<Utilisateur> lesUtilisateurs = new ArrayList<>();
        String requete = "SELECT * FROM utilisateur;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = getConnexion().getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Utilisateur unUtilisateur = new Utilisateur(
                        lesResultats.getInt("id_utilisateur"),
                        lesResultats.getString("nom"),
                        lesResultats.getString("prenom"),
                        lesResultats.getString("email"),
                        lesResultats.getString("mot_de_passe"),
                        lesResultats.getString("role"), null
                );
                lesUtilisateurs.add(unUtilisateur);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesUtilisateurs;
    }

    public static void deleteUtilisateur(int idUtilisateur) {
        String requete = "DELETE FROM utilisateur WHERE id_utilisateur = " + idUtilisateur + " ;";
        executerRequete(requete);
    }

    public static void updateUtilisateur(Utilisateur unUtilisateur) {
        String requete = "UPDATE utilisateur SET "
                + "nom = '" + unUtilisateur.getNom() + "', "
                + "prenom = '" + unUtilisateur.getPrenom() + "', "
                + "email = '" + unUtilisateur.getEmail() + "', "
                + "role = '" + unUtilisateur.getRole() + "'";

        if (unUtilisateur.getMotDePasse() != null && !unUtilisateur.getMotDePasse().isEmpty()) {
            String motDePasseHash = BCrypt.hashpw(unUtilisateur.getMotDePasse(), BCrypt.gensalt());
            requete += ", mot_de_passe = '" + motDePasseHash + "'";
        }

        requete += " WHERE id_utilisateur = " + unUtilisateur.getIdUtilisateur() + " ;";

        executerRequete(requete);
    }



    public static ArrayList<Utilisateur> selectLikeUtilisateurs(String filtre) {
        ArrayList<Utilisateur> lesUtilisateurs = new ArrayList<>();
        String requete = "SELECT * FROM utilisateur WHERE nom LIKE '%" + filtre
                + "%' OR prenom LIKE '%" + filtre
                + "%' OR email LIKE '%" + filtre
                + "%' OR role LIKE '%" + filtre + "%' ;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = getConnexion().getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                Utilisateur unUtilisateur = new Utilisateur(
                        lesResultats.getInt("id_utilisateur"),
                        lesResultats.getString("nom"),
                        lesResultats.getString("prenom"),
                        lesResultats.getString("email"),
                        lesResultats.getString("mot_de_passe"),
                        lesResultats.getString("role"), null
                );
                lesUtilisateurs.add(unUtilisateur);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesUtilisateurs;
    }

    public static Utilisateur selectWhereUtilisateur(String email, String motDePasse) {
        String requete = "SELECT * FROM utilisateur WHERE email = ?";
        Utilisateur unUtilisateur = null;
        try {
            uneConnexion.seConnecter();
            PreparedStatement unStat = getConnexion().getMaConnexion().prepareStatement(requete);
            unStat.setString(1, email);
            ResultSet unResultat = unStat.executeQuery();
            if (unResultat.next()) {
                String hash = unResultat.getString("mot_de_passe");
                if (BCrypt.checkpw(motDePasse, hash)) {
                    unUtilisateur = new Utilisateur(
                        unResultat.getInt("id_utilisateur"),
                        unResultat.getString("nom"),
                        unResultat.getString("prenom"),
                        unResultat.getString("email"),
                        hash,
                        unResultat.getString("role"),
                        null
                    );
                }
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
            exp.printStackTrace();
        }
        return unUtilisateur;
    }



    /************************ GESTION DES PROPRIÉTAIRES **********************/

    public static void insertProprietaire(Proprietaire unProprietaire) {
        String requete = "INSERT INTO proprietaire VALUES (null, " + unProprietaire.getIdUtilisateur() 
                + ", '" + unProprietaire.getLogements() + "');";
        
        executerRequete(requete);
    }

    public static ArrayList<Proprietaire> selectAllProprietaires() {
        ArrayList<Proprietaire> lesProprietaires = new ArrayList<>();
        String requete = "SELECT * FROM proprietaire;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                // Instanciation d'un propriétaire
                Proprietaire unProprietaire = new Proprietaire(
                        lesResultats.getInt("id_proprietaire"),
                        lesResultats.getInt("id_utilisateur"),
                        lesResultats.getString("logements")
                );
                // On ajoute le propriétaire dans l'ArrayList
                lesProprietaires.add(unProprietaire);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesProprietaires;
    }

    public static void deleteProprietaire(int idProprietaire) {
        String requete = "DELETE FROM proprietaire WHERE id_proprietaire = " + idProprietaire + " ;";
        executerRequete(requete);
    }

    public static void updateProprietaire(Proprietaire unProprietaire) {
        String requete = "UPDATE proprietaire SET id_utilisateur = " + unProprietaire.getIdUtilisateur()
                + ", logements = '" + unProprietaire.getLogements()
                + "' WHERE id_proprietaire = " + unProprietaire.getIdProprietaire() + " ;";

        executerRequete(requete);
    }

    public static ArrayList<Proprietaire> selectLikeProprietaires(String filtre) {
        ArrayList<Proprietaire> lesProprietaires = new ArrayList<>();
        String requete = "SELECT * FROM proprietaire WHERE id_utilisateur LIKE '%" + filtre
                + "%' OR logements LIKE '%" + filtre + "%' ;";

        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                // Instanciation d'un propriétaire
                Proprietaire unProprietaire = new Proprietaire(
                        lesResultats.getInt("id_proprietaire"),
                        lesResultats.getInt("id_utilisateur"),
                        lesResultats.getString("logements")
                );
                // On ajoute le propriétaire dans l'ArrayList
                lesProprietaires.add(unProprietaire);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesProprietaires;
    }

    public static Proprietaire selectWhereProprietaire(int idProprietaire) {
        String requete = "SELECT * FROM proprietaire WHERE id_proprietaire = " + idProprietaire + " ;";
        Proprietaire unProprietaire = null;
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet unResultat = unStat.executeQuery(requete);
            if (unResultat.next()) {
                // Instanciation du propriétaire
                unProprietaire = new Proprietaire(
                        unResultat.getInt("id_proprietaire"),
                        unResultat.getInt("id_utilisateur"),
                        unResultat.getString("logements")
                );
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return unProprietaire;
    }
    
    
    /************************ GESTION DES LOGEMENTS **********************/

    public static void insertLogement(Logement unLogement) {
        String requete = "INSERT INTO logement VALUES (null, " + unLogement.getIdProprietaire()
                + ", '" + unLogement.getNomImmeuble() + "', '" + unLogement.getAdresse()
                + "', '" + unLogement.getCodePostal() + "', '" + unLogement.getVille()
                + "', '" + unLogement.getTypeLogement() + "', " + unLogement.getSurfaceHabitable()
                + ", " + unLogement.getCapaciteAccueil() + ", '" + unLogement.getSpecifite()
                + "', '" + unLogement.getPhoto() + "');";
        
        executerRequete(requete);
    }

    public static ArrayList<Logement> selectAllLogements() {
        ArrayList<Logement> lesLogements = new ArrayList<>();
        String requete = "SELECT * FROM logement;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                // Instanciation d'un logement
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
                        lesResultats.getString("photo")
                );
                // On ajoute le logement dans l'ArrayList
                lesLogements.add(unLogement);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesLogements;
    }

    public static void deleteLogement(int idLogement) {
        String requete = "DELETE FROM logement WHERE id_logement = " + idLogement + " ;";
        executerRequete(requete);
    }

    public static void updateLogement(Logement unLogement) {
        String requete = "UPDATE logement SET id_proprietaire = " + unLogement.getIdProprietaire()
                + ", nom_immeuble = '" + unLogement.getNomImmeuble()
                + "', adresse = '" + unLogement.getAdresse()
                + "', code_postal = '" + unLogement.getCodePostal()
                + "', ville = '" + unLogement.getVille()
                + "', type_logement = '" + unLogement.getTypeLogement()
                + "', surface_habitable = " + unLogement.getSurfaceHabitable()
                + ", capacite_accueil = " + unLogement.getCapaciteAccueil()
                + ", specifite = '" + unLogement.getSpecifite()
                + "', photo = '" + unLogement.getPhoto()
                + "' WHERE id_logement = " + unLogement.getIdLogement() + " ;";

        executerRequete(requete);
    }

    public static ArrayList<Logement> selectLikeLogements(String filtre) {
        ArrayList<Logement> lesLogements = new ArrayList<>();
        String requete = "SELECT * FROM logement WHERE nom_immeuble LIKE '%" + filtre
                + "%' OR adresse LIKE '%" + filtre
                + "%' OR ville LIKE '%" + filtre
                + "%' OR type_logement LIKE '%" + filtre + "%' ;";

        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                // Instanciation d'un logement
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
                        lesResultats.getString("photo")
                );
                // On ajoute le logement dans l'ArrayList
                lesLogements.add(unLogement);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesLogements;
    }

    public static Logement selectWhereLogement(int idLogement) {
        String requete = "SELECT * FROM logement WHERE id_logement = " + idLogement + " ;";
        Logement unLogement = null;
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet unResultat = unStat.executeQuery(requete);
            if (unResultat.next()) {
                // Instanciation du logement
                unLogement = new Logement(
                        unResultat.getInt("id_logement"),
                        unResultat.getInt("id_proprietaire"),
                        unResultat.getString("nom_immeuble"),
                        unResultat.getString("adresse"),
                        unResultat.getString("code_postal"),
                        unResultat.getString("ville"),
                        unResultat.getString("type_logement"),
                        unResultat.getFloat("surface_habitable"),
                        unResultat.getInt("capacite_accueil"),
                        unResultat.getString("specifite"),
                        unResultat.getString("photo")
                );
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return unLogement;
    }
    
    
    /************************ GESTION DES RÉSERVATIONS **********************/

    public static void insertReservation(Reservation uneReservation) {
        String requete = "INSERT INTO reservation VALUES (null, " + uneReservation.getIdUtilisateur()
                + ", " + uneReservation.getIdLogement()
                + ", '" + uneReservation.getDateDebut()
                + "', '" + uneReservation.getDateFin()
                + "', '" + uneReservation.getStatut() + "');";

        executerRequete(requete);
    }

    public static ArrayList<Reservation> selectAllReservations() {
        ArrayList<Reservation> lesReservations = new ArrayList<>();
        String requete = "SELECT * FROM reservation;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                // Instanciation d'une réservation
                Reservation uneReservation = new Reservation(
                        lesResultats.getInt("id_reservation"),
                        lesResultats.getInt("id_utilisateur"),
                        lesResultats.getInt("id_logement"),
                        lesResultats.getString("date_debut"),
                        lesResultats.getString("date_fin"),
                        lesResultats.getString("statut")
                );
                // On ajoute la réservation dans l'ArrayList
                lesReservations.add(uneReservation);
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesReservations;
    }

    public static void deleteReservation(int idReservation) {
        String requete = "DELETE FROM reservation WHERE id_reservation = " + idReservation + " ;";
        executerRequete(requete);
    }
    public static void executerRequete(String requete) {
        try {
            uneConnexion.seConnecter();
            Statement unStat = getConnexion().getMaConnexion().createStatement();
            unStat.execute(requete);
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
    }
    
    public static void updateReservation(Reservation uneReservation) {
        String requete = "UPDATE reservation SET id_utilisateur = " + uneReservation.getIdUtilisateur()
                + ", id_logement = " + uneReservation.getIdLogement()
                + ", date_debut = '" + uneReservation.getDateDebut()
                + "', date_fin = '" + uneReservation.getDateFin()
                + "', statut = '" + uneReservation.getStatut()
                + "' WHERE id_reservation = " + uneReservation.getIdReservation() + ";";

        executerRequete(requete);
    }

    public static ArrayList<Reservation> selectLikeReservations(String filtre) {
        ArrayList<Reservation> lesReservations = new ArrayList<>();
        String requete = "SELECT * FROM reservation WHERE statut LIKE '%" + filtre
                + "%' OR date_debut LIKE '%" + filtre
                + "%' OR date_fin LIKE '%" + filtre
                + "%' OR id_reservation LIKE '%" + filtre + "%';";

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
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return lesReservations;
    }

    public static Reservation selectWhereReservation(int idReservation) {
        String requete = "SELECT * FROM reservation WHERE id_reservation = " + idReservation + ";";
        Reservation uneReservation = null;

        try {
            uneConnexion.seConnecter();
            Statement unStat = uneConnexion.getMaConnexion().createStatement();
            ResultSet unResultat = unStat.executeQuery(requete);
            if (unResultat.next()) {
                uneReservation = new Reservation(
                        unResultat.getInt("id_reservation"),
                        unResultat.getInt("id_utilisateur"),
                        unResultat.getInt("id_logement"),
                        unResultat.getString("date_debut"),
                        unResultat.getString("date_fin"),
                        unResultat.getString("statut")
                );
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return uneReservation;
    }


    public static int count(String table) {
        int nb = 0;
        String requete = "SELECT count(*) as nb FROM " + table + ";";
        try {
            uneConnexion.seConnecter();
            Statement unStat = getConnexion().getMaConnexion().createStatement();
            ResultSet unResultat = unStat.executeQuery(requete);
            if (unResultat.next()) {
                nb = unResultat.getInt("nb");
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return nb;
    }

    public static ArrayList<String[]> getStatistiquesGlobales() {
        ArrayList<String[]> statistiques = new ArrayList<>();
        String requete = "SELECT * FROM statistiques_globales_par_periode ORDER BY annee DESC, mois DESC;";
        try {
            uneConnexion.seConnecter();
            Statement unStat = getConnexion().getMaConnexion().createStatement();
            ResultSet lesResultats = unStat.executeQuery(requete);
            while (lesResultats.next()) {
                String annee = lesResultats.getString("annee");
                String mois = lesResultats.getString("mois");
                String nbReservations = lesResultats.getString("nombre_total_reservations");
                String revenuTotal = lesResultats.getString("revenu_total_reservations");
                String activitePopulaire = lesResultats.getString("activite_plus_populaire");
                String villePlusLogements = lesResultats.getString("ville_plus_logements");
                String proprietaireRentable = lesResultats.getString("proprietaire_plus_rentable");
                String utilisateurActif = lesResultats.getString("utilisateur_plus_actif");

                statistiques.add(new String[]{annee, mois, nbReservations, revenuTotal, activitePopulaire, villePlusLogements, proprietaireRentable, utilisateurActif});
            }
            unStat.close();
            uneConnexion.seDeConnecter();
        } catch (SQLException exp) {
            System.out.println("Erreur d'exécution de la requête : " + requete);
        }
        return statistiques;
    }
}
